import json
import uuid
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import (
    ResearchProject, Source, Claim, Evidence, Statistic,
    AcademicPaper, Entity, Relationship, Contradiction,
    ResearchGap, TimelineEvent, ImageAsset, Report, ActivityEvent
)
from app.schemas.schemas import (
    ResearchCreateRequest, FollowUpRequest, AskRequest,
    ProjectOverviewOut, SourceOut, ClaimOut, EvidenceOut,
    StatisticOut, AcademicPaperOut, EntityOut, RelationshipOut,
    ContradictionOut, ResearchGapOut, TimelineEventOut,
    ImageAssetOut, ReportOut, ActivityEventOut, HealthResponse
)
from app.services.openai_service import openai_service
from app.services.tavily_service import tavily_service
from app.services.semantic_scholar import semantic_scholar_service
from app.research.orchestrator import ResearchEngine, event_broker

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        backend="OK",
        database="OK",
        openai="configured" if openai_service.is_configured else "not configured",
        tavily="configured" if tavily_service.is_configured else "not configured",
        semantic_scholar="configured" if semantic_scholar_service.is_configured else "not configured"
    )

@router.get("/projects", response_model=List[ProjectOverviewOut])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(ResearchProject).order_by(ResearchProject.created_at.desc()).all()
    out = []
    for p in projects:
        out.append(ProjectOverviewOut(
            id=p.id,
            title=p.title,
            research_question=p.research_question,
            status=p.status,
            depth=p.depth,
            quality_score=p.quality_score,
            sources_count=len(p.sources),
            claims_count=len(p.claims),
            evidence_count=len(p.evidence),
            statistics_count=len(p.statistics),
            academic_papers_count=len(p.academic_papers),
            entities_count=len(p.entities),
            contradictions_count=len(p.contradictions),
            gaps_count=len(p.research_gaps),
            images_count=len(p.image_assets),
            created_at=p.created_at,
            updated_at=p.updated_at
        ))
    return out

@router.post("/research")
async def create_research(req: ResearchCreateRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    project_id = str(uuid.uuid4())
    project = ResearchProject(
        id=project_id,
        title=req.research_question[:80] + ("..." if len(req.research_question) > 80 else ""),
        research_question=req.research_question,
        depth=req.depth,
        source_types=req.source_types,
        options=req.options,
        status="created"
    )
    db.add(project)
    db.commit()

    engine = ResearchEngine(project_id)
    background_tasks.add_task(engine.run)

    return {"id": project_id, "status": "created", "research_question": req.research_question}

@router.get("/research/{project_id}")
def get_research_project(project_id: str, db: Session = Depends(get_db)):
    p = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {
        "id": p.id,
        "title": p.title,
        "research_question": p.research_question,
        "status": p.status,
        "depth": p.depth,
        "summary": p.summary,
        "quality_score": p.quality_score,
        "sources_count": len(p.sources),
        "claims_count": len(p.claims),
        "evidence_count": len(p.evidence),
        "statistics_count": len(p.statistics),
        "academic_papers_count": len(p.academic_papers),
        "entities_count": len(p.entities),
        "contradictions_count": len(p.contradictions),
        "gaps_count": len(p.research_gaps),
        "images_count": len(p.image_assets),
        "created_at": p.created_at
    }

@router.get("/research/{project_id}/stream")
async def stream_research_events(project_id: str, request: Request, db: Session = Depends(get_db)):
    """Server-Sent Events endpoint for real-time live research monitoring."""
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    async def event_generator():
        q = event_broker.subscribe(project_id)
        try:
            # Yield initial connect signal
            yield f"data: {json.dumps({'event_type': 'connected', 'stage': 'Workspace', 'message': 'Live event stream established', 'details': {}})}\n\n"
            
            while True:
                if await request.is_disconnected():
                    break
                try:
                    payload = await asyncio.wait_for(q.get(), timeout=15.0)
                    yield f"data: {json.dumps(payload)}\n\n"
                    if payload.get("event_type") in ("researchcompleted", "research_failed"):
                        break
                except asyncio.TimeoutError:
                    # Keep-alive ping
                    yield f": keep-alive\n\n"
        finally:
            event_broker.unsubscribe(project_id, q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/research/{project_id}/activity", response_model=List[ActivityEventOut])
def get_activity_events(project_id: str, db: Session = Depends(get_db)):
    events = db.query(ActivityEvent).filter(ActivityEvent.project_id == project_id).order_by(ActivityEvent.created_at.asc()).all()
    return [
        ActivityEventOut(
            id=e.id,
            event_type=e.event_type,
            stage=e.stage,
            message=e.message,
            details=e.details or {},
            created_at=e.created_at
        )
        for e in events
    ]

@router.get("/research/{project_id}/sources", response_model=List[SourceOut])
def get_sources(project_id: str, db: Session = Depends(get_db)):
    sources = db.query(Source).filter(Source.project_id == project_id).all()
    return [
        SourceOut(
            id=s.id,
            url=s.url,
            title=s.title,
            domain=s.domain,
            snippet=s.snippet,
            source_type=s.source_type,
            relevance_score=s.relevance_score,
            quality_score=s.quality_score,
            published_date=s.published_date,
            is_extracted=s.is_extracted,
            created_at=s.created_at
        )
        for s in sources
    ]

@router.get("/research/{project_id}/claims", response_model=List[ClaimOut])
def get_claims(project_id: str, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.project_id == project_id).all()
    return [
        ClaimOut(
            id=c.id,
            claim_text=c.claim_text,
            topic=c.topic,
            confidence=c.confidence,
            is_disputed=c.is_disputed,
            supporting_source_ids=c.supporting_source_ids or [],
            contradicting_source_ids=c.contradicting_source_ids or []
        )
        for c in claims
    ]

@router.get("/research/{project_id}/evidence", response_model=List[EvidenceOut])
def get_evidence(project_id: str, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.project_id == project_id).all()
    return [
        EvidenceOut(
            id=e.id,
            source_id=e.source_id,
            claim_id=e.claim_id,
            text=e.text,
            evidence_type=e.evidence_type,
            relevance=e.relevance,
            confidence=e.confidence,
            date=e.date
        )
        for e in evidence
    ]

@router.get("/research/{project_id}/statistics", response_model=List[StatisticOut])
def get_statistics(project_id: str, db: Session = Depends(get_db)):
    stats = db.query(Statistic).filter(Statistic.project_id == project_id).all()
    return [
        StatisticOut(
            id=s.id,
            source_id=s.source_id,
            metric=s.metric,
            value=s.value,
            value_display=s.value_display,
            unit=s.unit,
            year=s.year,
            date=s.date,
            geography=s.geography,
            category=s.category,
            confidence=s.confidence,
            source_title=s.source_title
        )
        for s in stats
    ]

@router.get("/research/{project_id}/academic", response_model=List[AcademicPaperOut])
def get_academic_papers(project_id: str, db: Session = Depends(get_db)):
    papers = db.query(AcademicPaper).filter(AcademicPaper.project_id == project_id).all()
    return [
        AcademicPaperOut(
            id=p.id,
            paper_id=p.paper_id,
            title=p.title,
            abstract=p.abstract,
            authors=p.authors or [],
            year=p.year,
            venue=p.venue,
            citation_count=p.citation_count,
            url=p.url,
            doi=p.doi,
            fields_of_study=p.fields_of_study or []
        )
        for p in papers
    ]

@router.get("/research/{project_id}/entities", response_model=List[EntityOut])
def get_entities(project_id: str, db: Session = Depends(get_db)):
    entities = db.query(Entity).filter(Entity.project_id == project_id).all()
    return [
        EntityOut(
            id=e.id,
            name=e.name,
            entity_type=e.entity_type,
            description=e.description,
            mention_count=e.mention_count,
            related_claims_count=e.related_claims_count
        )
        for e in entities
    ]

@router.get("/research/{project_id}/relationships", response_model=List[RelationshipOut])
def get_relationships(project_id: str, db: Session = Depends(get_db)):
    rels = db.query(Relationship).filter(Relationship.project_id == project_id).all()
    return [
        RelationshipOut(
            id=r.id,
            source_entity=r.source_entity,
            target_entity=r.target_entity,
            relation_type=r.relation_type,
            description=r.description,
            supporting_evidence_ids=r.supporting_evidence_ids or []
        )
        for r in rels
    ]

@router.get("/research/{project_id}/contradictions", response_model=List[ContradictionOut])
def get_contradictions(project_id: str, db: Session = Depends(get_db)):
    items = db.query(Contradiction).filter(Contradiction.project_id == project_id).all()
    return [
        ContradictionOut(
            id=c.id,
            topic=c.topic,
            position_a=c.position_a,
            sources_a=c.sources_a or [],
            position_b=c.position_b,
            sources_b=c.sources_b or [],
            likely_explanation=c.likely_explanation,
            contradiction_type=c.contradiction_type,
            confidence=c.confidence
        )
        for c in items
    ]

@router.get("/research/{project_id}/gaps", response_model=List[ResearchGapOut])
def get_research_gaps(project_id: str, db: Session = Depends(get_db)):
    gaps = db.query(ResearchGap).filter(ResearchGap.project_id == project_id).all()
    return [
        ResearchGapOut(
            id=g.id,
            gap_description=g.gap_description,
            category=g.category,
            suggested_query=g.suggested_query,
            resolved=g.resolved
        )
        for g in gaps
    ]

@router.get("/research/{project_id}/timeline", response_model=List[TimelineEventOut])
def get_timeline(project_id: str, db: Session = Depends(get_db)):
    events = db.query(TimelineEvent).filter(TimelineEvent.project_id == project_id).order_by(TimelineEvent.year.asc()).all()
    return [
        TimelineEventOut(
            id=t.id,
            date=t.date,
            year=t.year,
            title=t.title,
            description=t.description,
            source_id=t.source_id,
            source_title=t.source_title,
            confidence=t.confidence
        )
        for t in events
    ]

@router.get("/research/{project_id}/images", response_model=List[ImageAssetOut])
def get_images(project_id: str, db: Session = Depends(get_db)):
    images = db.query(ImageAsset).filter(ImageAsset.project_id == project_id).all()
    return [
        ImageAssetOut(
            id=img.id,
            image_url=img.image_url,
            source_url=img.source_url,
            source_title=img.source_title,
            caption=img.caption,
            query=img.query,
            attribution=img.attribution
        )
        for img in images
    ]

@router.get("/research/{project_id}/report", response_model=Optional[ReportOut])
def get_report(project_id: str, db: Session = Depends(get_db)):
    rep = db.query(Report).filter(Report.project_id == project_id).first()
    if not rep:
        return None
    return ReportOut(
        id=rep.id,
        title=rep.title,
        executive_summary=rep.executive_summary,
        methodology=rep.methodology,
        scope=rep.scope,
        key_findings=rep.key_findings or [],
        detailed_analysis=rep.detailed_analysis,
        conclusion=rep.conclusion,
        report_markdown=rep.report_markdown
    )

@router.post("/research/{project_id}/ask")
async def ask_research(project_id: str, req: AskRequest):
    engine = ResearchEngine(project_id)
    return await engine.answer_question(req.question)

@router.post("/research/{project_id}/follow-up")
async def follow_up_research(project_id: str, req: FollowUpRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Triggers targeted follow-up research into a specific gap or contradiction without wiping previous data."""
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    async def run_follow_up():
        async with httpx.AsyncClient():
            await event_broker.publish(project_id, "followupsearchstarted", "Follow-up", f"Initiating targeted deep-dive: '{req.query}'")
            if tavily_service.is_configured:
                res = await tavily_service.search(query=req.query, max_results=4)
                for r in res.get("results", []):
                    # Store follow up sources
                    pass
            await event_broker.publish(project_id, "followupsearchcompleted", "Follow-up", f"Completed follow-up research for '{req.query}'")

    background_tasks.add_task(run_follow_up)
    return {"status": "started", "query": req.query}

@router.delete("/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"status": "deleted", "id": project_id}
