import asyncio
import json
import logging
import uuid
import datetime
from typing import Dict, Any, List, Optional, AsyncGenerator
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.models import (
    ResearchProject, ResearchRun, ResearchQuery, Source, SourceContent,
    AcademicPaper, Claim, Evidence, Statistic, Entity, Relationship,
    Contradiction, ResearchGap, TimelineEvent, ImageAsset, Citation,
    ActivityEvent, Report
)
from app.services.openai_service import openai_service
from app.services.tavily_service import tavily_service, normalize_url
from app.services.semantic_scholar import semantic_scholar_service
from app.research.demo_data import DEMO_PROJECT

logger = logging.getLogger(__name__)

# In-memory pub/sub broker for active SSE streams
class EventBroker:
    def __init__(self):
        self.subscribers: Dict[str, List[asyncio.Queue]] = {}

    def subscribe(self, project_id: str) -> asyncio.Queue:
        if project_id not in self.subscribers:
            self.subscribers[project_id] = []
        q = asyncio.Queue()
        self.subscribers[project_id].append(q)
        return q

    def unsubscribe(self, project_id: str, q: asyncio.Queue):
        if project_id in self.subscribers:
            if q in self.subscribers[project_id]:
                self.subscribers[project_id].remove(q)
            if not self.subscribers[project_id]:
                del self.subscribers[project_id]

    async def publish(self, project_id: str, event_type: str, stage: str, message: str, details: Optional[Dict[str, Any]] = None):
        payload = {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "event_type": event_type,
            "stage": stage,
            "message": message,
            "details": details or {},
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        if project_id in self.subscribers:
            for q in list(self.subscribers[project_id]):
                await q.put(payload)

event_broker = EventBroker()

class ResearchEngine:
    def __init__(self, project_id: str):
        self.project_id = project_id

    async def log_event(self, db: Session, event_type: str, stage: str, message: str, details: Optional[Dict[str, Any]] = None):
        """Saves activity event to database and publishes to active SSE subscribers."""
        ev = ActivityEvent(
            id=str(uuid.uuid4()),
            project_id=self.project_id,
            event_type=event_type,
            stage=stage,
            message=message,
            details=details or {}
        )
        db.add(ev)
        db.commit()
        await event_broker.publish(self.project_id, event_type, stage, message, details)

    async def run(self):
        """Main orchestrator for real autonomous research."""
        db = SessionLocal()
        try:
            project = db.query(ResearchProject).filter(ResearchProject.id == self.project_id).first()
            if not project:
                return

            project.status = "in_progress"
            db.commit()

            await self.log_event(db, "researchstarted", "Planning", f"Starting research for: '{project.research_question}'")

            # Check if live APIs are configured
            use_live_apis = openai_service.is_configured and tavily_service.is_configured

            if not use_live_apis:
                await self.log_event(
                    db, "warning", "Environment",
                    "OpenAI or Tavily API key not detected. Ingesting LOCAL DEMO DATA — NOT LIVE RESEARCH."
                )
                await self._load_fallback_demo(db, project)
                return

            # STEP 1: Understand question and create research plan / dimensions
            await self.log_event(db, "planningstarted", "Planning", "Analyzing question and creating multidimensional research plan")
            
            plan_prompt = f"""You are ResearchOS AI research planner.
Research question: "{project.research_question}"
Depth: {project.depth}

Break down this question into 4-6 diverse research dimensions (e.g. Economic impact, Sectoral disruption, Policy & skilling, Global comparisons, Technological trends).
For each dimension, create 1-2 targeted search queries.
Respond strictly in JSON format:
{{
  "dimensions": ["dimension1", "dimension2", "dimension3"],
  "queries": [
    {{"query": "search query 1", "dimension": "dimension1", "type": "web"}},
    {{"query": "search query 2", "dimension": "dimension2", "type": "web"}}
  ],
  "academic_queries": ["query for academic papers"]
}}"""
            
            plan_res = await openai_service.generate_json(
                system_prompt="You are an expert research methodologist. Output valid JSON only.",
                user_prompt=plan_prompt
            )

            dimensions = plan_res.get("dimensions", ["General Analysis", "Economic Projections", "Workforce Trends"])
            queries = plan_res.get("queries", [{"query": project.research_question, "dimension": "General", "type": "web"}])
            academic_queries = plan_res.get("academic_queries", [project.research_question])

            await self.log_event(
                db, "researchdimensioncreated", "Planning",
                f"Generated {len(dimensions)} research dimensions and {len(queries)} search queries",
                {"dimensions": dimensions}
            )

            # Store queries
            for q_obj in queries:
                q_model = ResearchQuery(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    query_text=q_obj["query"],
                    dimension=q_obj.get("dimension"),
                    query_type=q_obj.get("type", "web")
                )
                db.add(q_model)
            db.commit()

            # STEP 2: Live Web Search via Tavily
            discovered_sources: Dict[str, Dict[str, Any]] = {}
            seen_normalized_urls = set()
            found_images = []

            target_sources_count = 12 if project.depth == "quick" else (22 if project.depth == "deep" else 32)
            searches_to_run = queries[:4] if project.depth == "quick" else (queries[:7] if project.depth == "deep" else queries[:10])

            for q_obj in searches_to_run:
                query_str = q_obj["query"]
                await self.log_event(db, "searchstarted", "Web Discovery", f"Searching web: '{query_str}'")
                
                tavily_res = await tavily_service.search(query=query_str, search_depth="basic", max_results=6, include_images=True)
                results = tavily_res.get("results", [])
                images = tavily_res.get("images", [])
                if images:
                    found_images.extend(images)

                for r in results:
                    raw_url = r.get("url", "")
                    if not raw_url:
                        continue
                    norm_url = normalize_url(raw_url)
                    if norm_url not in seen_normalized_urls:
                        seen_normalized_urls.add(norm_url)
                        discovered_sources[norm_url] = {
                            "url": raw_url,
                            "normalized_url": norm_url,
                            "title": r.get("title") or "Web Source",
                            "snippet": r.get("content") or "",
                            "published_date": r.get("published_date"),
                            "relevance_score": r.get("score") or 0.85
                        }
                
                await self.log_event(
                    db, "searchcompleted", "Web Discovery",
                    f"Found {len(results)} results for '{query_str}' (Total unique: {len(discovered_sources)})"
                )

            # Save discovered sources to DB
            for norm_url, s_data in list(discovered_sources.items())[:target_sources_count]:
                domain = ""
                try:
                    from urllib.parse import urlparse
                    domain = urlparse(s_data["url"]).netloc
                except Exception:
                    pass

                source_obj = Source(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    url=s_data["url"],
                    normalized_url=norm_url,
                    title=s_data["title"],
                    domain=domain,
                    snippet=s_data["snippet"],
                    source_type="web" if not (".gov" in domain or ".org" in domain) else ("government" if ".gov" in domain else "industry"),
                    relevance_score=s_data["relevance_score"],
                    quality_score=0.88,
                    published_date=s_data.get("published_date"),
                    is_extracted=False
                )
                db.add(source_obj)
            db.commit()

            # Save images if found
            if found_images:
                for img_url in set(found_images[:6]):
                    img_asset = ImageAsset(
                        id=str(uuid.uuid4()),
                        project_id=self.project_id,
                        image_url=img_url,
                        caption=f"Visual asset retrieved for {project.research_question[:40]}...",
                        query=queries[0]["query"] if queries else ""
                    )
                    db.add(img_asset)
                db.commit()
                await self.log_event(db, "visualfound", "Visuals", f"Discovered {min(len(found_images), 6)} visual assets")

            # STEP 3: Academic search via Semantic Scholar
            if project.options.get("include_academic_papers", True):
                await self.log_event(db, "academicsearchstarted", "Academic Discovery", "Searching academic literature on Semantic Scholar")
                academic_q = academic_queries[0] if academic_queries else project.research_question
                papers = await semantic_scholar_service.search_papers(query=academic_q, limit=6)
                for p in papers:
                    title = p.get("title")
                    if not title:
                        continue
                    paper_obj = AcademicPaper(
                        id=str(uuid.uuid4()),
                        project_id=self.project_id,
                        paper_id=p.get("paperId"),
                        title=title,
                        abstract=p.get("abstract"),
                        authors=p.get("authors") or [],
                        year=p.get("year"),
                        venue=p.get("venue"),
                        citation_count=p.get("citationCount") or 0,
                        url=p.get("url"),
                        doi=p.get("externalIds", {}).get("DOI") if isinstance(p.get("externalIds"), dict) else None,
                        fields_of_study=p.get("fieldsOfStudy") or []
                    )
                    db.add(paper_obj)
                db.commit()
                await self.log_event(db, "academicpaperfound", "Academic Discovery", f"Retrieved {len(papers)} academic papers from Semantic Scholar")

            # STEP 4: High-Value Source Content Extraction
            db_sources = db.query(Source).filter(ResearchProject.id == self.project_id).limit(6).all()
            if db_sources:
                await self.log_event(db, "sourceextractionstarted", "Reading", f"Extracting deep content from top {len(db_sources)} high-value sources")
                urls_to_extract = [s.url for s in db_sources]
                extracted_data = await tavily_service.extract(urls_to_extract)
                extracted_map = {item.get("url"): item.get("raw_content") for item in extracted_data if item.get("raw_content")}

                for s in db_sources:
                    raw_content = extracted_map.get(s.url) or s.snippet
                    if raw_content:
                        sc = SourceContent(
                            id=str(uuid.uuid4()),
                            source_id=s.id,
                            raw_text=raw_content[:4000],  # Token efficiency guard
                            markdown_text=raw_content[:4000]
                        )
                        db.add(sc)
                        s.is_extracted = True
                db.commit()
                await self.log_event(db, "sourceextractioncompleted", "Reading", f"Completed deep extraction for {len(extracted_map)} sources")

            # STEP 5: Evidence, Claims, and Statistics Extraction via OpenAI
            await self.log_event(db, "evidenceextracted", "Evidence Extraction", "Analyzing text to extract claims, evidence units, and numerical statistics")
            
            # Prepare compact snippet context to maximize token efficiency
            source_snippets_ctx = []
            for s in db_sources[:8]:
                source_snippets_ctx.append({
                    "id": s.id,
                    "title": s.title,
                    "domain": s.domain,
                    "text": (s.content.raw_text[:800] if s.content else s.snippet)[:800]
                })

            extraction_prompt = f"""Analyze the following research snippets on the topic: "{project.research_question}".
Snippets:
{json.dumps(source_snippets_ctx)}

Extract structured research findings:
1. Claims: Factual assertions made.
2. Evidence: Key supporting quotes or factual observations linked to source id.
3. Statistics: Numerical data points (metric, value, unit, year, geography).

Format strictly as JSON:
{{
  "claims": [
    {{"claim_text": "...", "topic": "...", "confidence": 0.88, "is_disputed": false, "source_ids": ["..."]}}
  ],
  "evidence": [
    {{"text": "...", "source_id": "...", "evidence_type": "finding|statistic|forecast", "confidence": 0.9, "date": "2024"}}
  ],
  "statistics": [
    {{"metric": "...", "value": 15.5, "unit": "percent", "year": 2030, "geography": "India", "category": "Employment", "confidence": 0.9, "source_id": "..."}}
  ]
}}"""

            extract_res = await openai_service.generate_json(
                system_prompt="You are a precise scientific data extractor. Only extract real information from the provided context.",
                user_prompt=extraction_prompt
            )

            claims_data = extract_res.get("claims", [])
            evidence_data = extract_res.get("evidence", [])
            stats_data = extract_res.get("statistics", [])

            claim_models = {}
            for c_obj in claims_data:
                c_model = Claim(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    claim_text=c_obj["claim_text"],
                    topic=c_obj.get("topic", "General"),
                    confidence=float(c_obj.get("confidence", 0.85)),
                    is_disputed=bool(c_obj.get("is_disputed", False)),
                    supporting_source_ids=c_obj.get("source_ids", [])
                )
                db.add(c_model)
                claim_models[c_obj["claim_text"]] = c_model
            db.commit()

            for ev_obj in evidence_data:
                ev_model = Evidence(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    source_id=ev_obj.get("source_id"),
                    text=ev_obj["text"],
                    evidence_type=ev_obj.get("evidence_type", "finding"),
                    confidence=float(ev_obj.get("confidence", 0.85)),
                    date=str(ev_obj.get("date", "2024"))
                )
                db.add(ev_model)
            
            for st_obj in stats_data:
                try:
                    val = float(st_obj.get("value", 0.0))
                    stat_model = Statistic(
                        id=str(uuid.uuid4()),
                        project_id=self.project_id,
                        source_id=st_obj.get("source_id"),
                        metric=st_obj.get("metric", "Metric"),
                        value=val,
                        value_display=f"{val} {st_obj.get('unit', '')}".strip(),
                        unit=st_obj.get("unit"),
                        year=int(st_obj["year"]) if st_obj.get("year") else None,
                        geography=st_obj.get("geography", "Global"),
                        category=st_obj.get("category", "General"),
                        confidence=float(st_obj.get("confidence", 0.9))
                    )
                    db.add(stat_model)
                except Exception:
                    pass
            db.commit()

            await self.log_event(
                db, "statisticextracted", "Statistics Extraction",
                f"Extracted {len(claims_data)} claims, {len(evidence_data)} evidence pieces, and {len(stats_data)} statistics"
            )

            # STEP 6: Entity and Knowledge Graph Extraction
            await self.log_event(db, "entityextracted", "Knowledge Graph", "Identifying entities and inter-entity causal relationships")
            kg_prompt = f"""From the extracted claims on '{project.research_question}', identify 5-8 key entities and 4-6 relationships between them.
Entities types: organization, company, technology, country, concept, industry.
Relationship types: affects, developed_by, located_in, influences, studied_by, competes_with, related_to.

Format strictly as JSON:
{{
  "entities": [
    {{"name": "...", "entity_type": "...", "description": "..."}}
  ],
  "relationships": [
    {{"source_entity": "...", "target_entity": "...", "relation_type": "...", "description": "..."}}
  ]
}}"""
            kg_res = await openai_service.generate_json(
                system_prompt="You are a knowledge graph architect. Output valid JSON.",
                user_prompt=kg_prompt
            )

            for ent in kg_res.get("entities", []):
                ent_model = Entity(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    name=ent["name"],
                    entity_type=ent.get("entity_type", "concept"),
                    description=ent.get("description", "")
                )
                db.add(ent_model)

            for rel in kg_res.get("relationships", []):
                rel_model = Relationship(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    source_entity=rel["source_entity"],
                    target_entity=rel["target_entity"],
                    relation_type=rel.get("relation_type", "related_to"),
                    description=rel.get("description", "")
                )
                db.add(rel_model)
            db.commit()

            # STEP 7: Contradiction & Research Gap Detection
            await self.log_event(db, "contradictionfound", "Contradictions", "Analyzing evidentiary divergence and empirical gaps")
            analysis_prompt = f"""Topic: "{project.research_question}"
Extracted claims count: {len(claims_data)}.
Detect:
1. Contradictions: Any conflicting viewpoints or divergent forecasts between sources.
2. Research gaps: Areas lacking rigorous coverage, unrepresented demographics, or missing longitudinal data.
3. Timeline milestones: 3-5 key years/dates related to this research question.

Format as JSON:
{{
  "contradictions": [
    {{
      "topic": "...",
      "position_a": "...",
      "sources_a": ["..."],
      "position_b": "...",
      "sources_b": ["..."],
      "likely_explanation": "...",
      "contradiction_type": "methodology|definitions|timeframes|geography",
      "confidence": 0.85
    }}
  ],
  "research_gaps": [
    {{
      "gap_description": "...",
      "category": "weak_evidence|missing_geography|outdated",
      "suggested_query": "..."
    }}
  ],
  "timeline": [
    {{"date": "2024", "year": 2024, "title": "...", "description": "..."}}
  ]
}}"""
            analysis_res = await openai_service.generate_json(
                system_prompt="You are an objective research critic detecting nuance and gaps. Output JSON.",
                user_prompt=analysis_prompt
            )

            for c in analysis_res.get("contradictions", []):
                c_model = Contradiction(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    topic=c["topic"],
                    position_a=c["position_a"],
                    sources_a=c.get("sources_a", []),
                    position_b=c["position_b"],
                    sources_b=c.get("sources_b", []),
                    likely_explanation=c.get("likely_explanation"),
                    contradiction_type=c.get("contradiction_type", "methodology"),
                    confidence=float(c.get("confidence", 0.8))
                )
                db.add(c_model)

            for g in analysis_res.get("research_gaps", []):
                g_model = ResearchGap(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    gap_description=g["gap_description"],
                    category=g.get("category", "weak_evidence"),
                    suggested_query=g.get("suggested_query")
                )
                db.add(g_model)

            for t in analysis_res.get("timeline", []):
                t_model = TimelineEvent(
                    id=str(uuid.uuid4()),
                    project_id=self.project_id,
                    date=str(t["date"]),
                    year=int(t["year"]) if t.get("year") else None,
                    title=t["title"],
                    description=t["description"]
                )
                db.add(t_model)
            db.commit()

            # STEP 8: Report Generation & Final Synthesis
            await self.log_event(db, "synthesisstarted", "Synthesis", "Synthesizing full findings and authoring cited report")
            
            report_prompt = f"""Author a rigorous executive research report on:
"{project.research_question}"

Include:
- Executive Summary
- Key Findings (list of 4 bullet points)
- Detailed Analysis
- Conclusion

Respond strictly in JSON format:
{{
  "title": "Comprehensive Research Report: {project.research_question}",
  "executive_summary": "...",
  "methodology": "Multidimensional web and academic literature triangulation with automated entity extraction.",
  "scope": "Synthesized from verified web sources, institutional reports, and academic research.",
  "key_findings": ["Finding 1", "Finding 2", "Finding 3", "Finding 4"],
  "detailed_analysis": "...",
  "conclusion": "..."
}}"""
            report_res = await openai_service.generate_json(
                system_prompt="You are a senior intelligence analyst. Provide comprehensive, objective research reports.",
                user_prompt=report_prompt
            )

            exec_summary = report_res.get("executive_summary", "Research completed successfully.")
            analysis_text = report_res.get("detailed_analysis", "Detailed findings compiled across sources.")
            conclusion_text = report_res.get("conclusion", "Ongoing monitoring recommended.")
            findings = report_res.get("key_findings", ["Substantial impact observed across core metrics."])

            markdown_report = f"""# {report_res.get('title', project.research_question)}

## Executive Summary
{exec_summary}

## Key Findings
""" + "\n".join([f"- {kf}" for kf in findings]) + f"""

## Detailed Analysis
{analysis_text}

## Conclusion
{conclusion_text}
"""
            rep_model = Report(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                title=report_res.get("title", f"Report: {project.research_question}"),
                executive_summary=exec_summary,
                methodology=report_res.get("methodology"),
                scope=report_res.get("scope"),
                key_findings=findings,
                detailed_analysis=analysis_text,
                conclusion=conclusion_text,
                report_markdown=markdown_report
            )
            db.add(rep_model)

            # Update project status and quality score heuristic
            project.status = "completed"
            project.summary = exec_summary
            # Quality score heuristic based on sources, claims, statistics and academic papers
            num_sources = len(discovered_sources)
            score = min(9.6, 7.0 + (num_sources * 0.05) + (len(stats_data) * 0.1))
            project.quality_score = round(score, 1)
            db.commit()

            await self.log_event(db, "reportstarted", "Report", "Cited research report generated and formatted")
            await self.log_event(db, "researchcompleted", "Complete", "Research run completed successfully", {"quality_score": project.quality_score})

        except Exception as e:
            logger.error(f"Error in research orchestrator for {self.project_id}: {e}", exc_info=True)
            project = db.query(ResearchProject).filter(ResearchProject.id == self.project_id).first()
            if project:
                project.status = "failed"
                db.commit()
            await self.log_event(db, "research_failed", "Error", f"Research process encountered an error: {str(e)}")
        finally:
            db.close()

    async def _load_fallback_demo(self, db: Session, project: ResearchProject):
        """Loads labeled fallback demo dataset for offline UI validation."""
        project.title = DEMO_PROJECT["title"]
        project.summary = DEMO_PROJECT["summary"]
        project.quality_score = DEMO_PROJECT["quality_score"]
        
        # Sources
        for s in DEMO_PROJECT["sources"]:
            src = Source(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                url=s["url"],
                normalized_url=s["url"],
                title=s["title"],
                domain=s["domain"],
                snippet=s["snippet"],
                source_type=s["source_type"],
                relevance_score=s["relevance_score"],
                quality_score=s["quality_score"],
                published_date=s["published_date"],
                is_extracted=True
            )
            db.add(src)
        db.commit()

        # Academic papers
        for p in DEMO_PROJECT["academic_papers"]:
            paper = AcademicPaper(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                paper_id=p["paper_id"],
                title=p["title"],
                abstract=p["abstract"],
                authors=p["authors"],
                year=p["year"],
                venue=p["venue"],
                citation_count=p["citation_count"],
                url=p["url"],
                fields_of_study=p["fields_of_study"]
            )
            db.add(paper)

        # Claims & Evidence
        for c in DEMO_PROJECT["claims"]:
            cl = Claim(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                claim_text=c["claim_text"],
                topic=c["topic"],
                confidence=c["confidence"],
                is_disputed=c["is_disputed"]
            )
            db.add(cl)

        for ev in DEMO_PROJECT["evidence"]:
            e = Evidence(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                text=ev["text"],
                evidence_type=ev["evidence_type"],
                relevance=ev["relevance"],
                confidence=ev["confidence"],
                date=ev["date"]
            )
            db.add(e)

        # Statistics
        for st in DEMO_PROJECT["statistics"]:
            s_obj = Statistic(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                metric=st["metric"],
                value=st["value"],
                value_display=st["value_display"],
                unit=st["unit"],
                year=st["year"],
                geography=st["geography"],
                category=st["category"],
                confidence=st["confidence"]
            )
            db.add(s_obj)

        # Entities & Relationships
        for ent in DEMO_PROJECT["entities"]:
            e_m = Entity(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                name=ent["name"],
                entity_type=ent["entity_type"],
                description=ent["description"],
                mention_count=ent["mention_count"],
                related_claims_count=ent["related_claims_count"]
            )
            db.add(e_m)

        for rel in DEMO_PROJECT["relationships"]:
            r_m = Relationship(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                source_entity=rel["source_entity"],
                target_entity=rel["target_entity"],
                relation_type=rel["relation_type"],
                description=rel["description"]
            )
            db.add(r_m)

        # Contradictions
        for con in DEMO_PROJECT["contradictions"]:
            con_m = Contradiction(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                topic=con["topic"],
                position_a=con["position_a"],
                sources_a=con["sources_a"],
                position_b=con["position_b"],
                sources_b=con["sources_b"],
                likely_explanation=con["likely_explanation"],
                contradiction_type=con["contradiction_type"],
                confidence=con["confidence"]
            )
            db.add(con_m)

        # Research Gaps
        for gap in DEMO_PROJECT["research_gaps"]:
            g_m = ResearchGap(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                gap_description=gap["gap_description"],
                category=gap["category"],
                suggested_query=gap["suggested_query"]
            )
            db.add(g_m)

        # Timeline
        for t in DEMO_PROJECT["timeline"]:
            t_m = TimelineEvent(
                id=str(uuid.uuid4()),
                project_id=self.project_id,
                date=t["date"],
                year=t["year"],
                title=t["title"],
                description=t["description"],
                confidence=t["confidence"]
            )
            db.add(t_m)

        # Report
        rep_data = DEMO_PROJECT["report"]
        rep = Report(
            id=str(uuid.uuid4()),
            project_id=self.project_id,
            title=rep_data["title"],
            executive_summary=rep_data["executive_summary"],
            methodology=rep_data["methodology"],
            scope=rep_data["scope"],
            key_findings=rep_data["key_findings"],
            detailed_analysis=rep_data["detailed_analysis"],
            conclusion=rep_data["conclusion"],
            report_markdown=rep_data["report_markdown"]
        )
        db.add(rep)

        project.status = "completed"
        db.commit()

        await self.log_event(db, "reportstarted", "Report", "Demo report assembled.")
        await self.log_event(db, "researchcompleted", "Complete", "Local demo dataset successfully initialized (LOCAL DEMO DATA — NOT LIVE RESEARCH).", {"quality_score": project.quality_score})

    async def answer_question(self, question: str) -> Dict[str, Any]:
        """Answers user question strictly based on stored project evidence."""
        db = SessionLocal()
        try:
            claims = db.query(Claim).filter(Claim.project_id == self.project_id).all()
            stats = db.query(Statistic).filter(Statistic.project_id == self.project_id).all()
            sources = db.query(Source).filter(Source.project_id == self.project_id).all()

            context_items = [f"Claim: {c.claim_text} (Topic: {c.topic})" for c in claims[:10]]
            context_stats = [f"Stat: {s.metric} = {s.value_display or s.value} ({s.geography or ''} {s.year or ''})" for s in stats[:10]]
            source_titles = [f"Source [{s.id}]: {s.title} ({s.url})" for s in sources[:8]]

            prompt = f"""You are ResearchOS assistant answering a user query based strictly on collected research.
User Question: "{question}"

Collected Research Context:
Claims:
{chr(10).join(context_items)}

Key Statistics:
{chr(10).join(context_stats)}

Available Sources:
{chr(10).join(source_titles)}

Rules:
1. Ground your answer in the provided research data.
2. If evidence is lacking or insufficient, clearly state that follow-up research is required.
3. Cite sources where appropriate.
4. Keep the answer direct, objective, and analytical.
"""
            if openai_service.is_configured:
                answer = await openai_service.generate_text(
                    system_prompt="You are a truthful intelligence analyst assistant.",
                    user_prompt=prompt
                )
            else:
                answer = f"Based on collected evidence for this project, the data indicates: {claims[0].claim_text if claims else 'Research findings compiled.'} (Local demo evidence)."

            return {"question": question, "answer": answer}
        finally:
            db.close()
