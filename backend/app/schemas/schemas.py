from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ResearchCreateRequest(BaseModel):
    research_question: str
    depth: str = "comprehensive"  # quick, deep, comprehensive
    source_types: List[str] = ["web", "academic", "government", "news", "industry"]
    options: Dict[str, bool] = Field(default_factory=lambda: {
        "include_statistics": True,
        "include_charts": True,
        "include_images": True,
        "include_academic_papers": True,
        "build_knowledge_graph": True,
        "detect_contradictions": True,
        "detect_research_gaps": True,
    })

class FollowUpRequest(BaseModel):
    query: str
    gap_id: Optional[str] = None
    claim_id: Optional[str] = None
    contradiction_id: Optional[str] = None

class AskRequest(BaseModel):
    question: str

class SourceOut(BaseModel):
    id: str
    url: str
    title: str
    domain: Optional[str] = None
    snippet: Optional[str] = None
    source_type: str
    relevance_score: float
    quality_score: float
    published_date: Optional[str] = None
    is_extracted: bool
    created_at: Optional[datetime] = None

class AcademicPaperOut(BaseModel):
    id: str
    paper_id: Optional[str] = None
    title: str
    abstract: Optional[str] = None
    authors: List[Any] = []
    year: Optional[int] = None
    venue: Optional[str] = None
    citation_count: int = 0
    url: Optional[str] = None
    doi: Optional[str] = None
    fields_of_study: List[str] = []

class ClaimOut(BaseModel):
    id: str
    claim_text: str
    topic: Optional[str] = None
    confidence: float
    is_disputed: bool
    supporting_source_ids: List[str] = []
    contradicting_source_ids: List[str] = []

class EvidenceOut(BaseModel):
    id: str
    source_id: Optional[str] = None
    claim_id: Optional[str] = None
    text: str
    evidence_type: str
    relevance: float
    confidence: float
    date: Optional[str] = None

class StatisticOut(BaseModel):
    id: str
    source_id: Optional[str] = None
    metric: str
    value: float
    value_display: Optional[str] = None
    unit: Optional[str] = None
    year: Optional[int] = None
    date: Optional[str] = None
    geography: Optional[str] = None
    category: Optional[str] = None
    confidence: float
    source_title: Optional[str] = None

class EntityOut(BaseModel):
    id: str
    name: str
    entity_type: str
    description: Optional[str] = None
    mention_count: int
    related_claims_count: int

class RelationshipOut(BaseModel):
    id: str
    source_entity: str
    target_entity: str
    relation_type: str
    description: Optional[str] = None
    supporting_evidence_ids: List[str] = []

class ContradictionOut(BaseModel):
    id: str
    topic: str
    position_a: str
    sources_a: List[str] = []
    position_b: str
    sources_b: List[str] = []
    likely_explanation: Optional[str] = None
    contradiction_type: str
    confidence: float

class ResearchGapOut(BaseModel):
    id: str
    gap_description: str
    category: str
    suggested_query: Optional[str] = None
    resolved: bool

class TimelineEventOut(BaseModel):
    id: str
    date: str
    year: Optional[int] = None
    title: str
    description: str
    source_id: Optional[str] = None
    source_title: Optional[str] = None
    confidence: float

class ImageAssetOut(BaseModel):
    id: str
    image_url: str
    source_url: Optional[str] = None
    source_title: Optional[str] = None
    caption: Optional[str] = None
    query: Optional[str] = None
    attribution: Optional[str] = None

class ReportOut(BaseModel):
    id: str
    title: str
    executive_summary: str
    methodology: Optional[str] = None
    scope: Optional[str] = None
    key_findings: List[str] = []
    detailed_analysis: str
    conclusion: str
    report_markdown: str

class ActivityEventOut(BaseModel):
    id: str
    event_type: str
    stage: str
    message: str
    details: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

class ProjectOverviewOut(BaseModel):
    id: str
    title: str
    research_question: str
    status: str
    depth: str
    quality_score: float
    sources_count: int
    claims_count: int
    evidence_count: int
    statistics_count: int
    academic_papers_count: int
    entities_count: int
    contradictions_count: int
    gaps_count: int
    images_count: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class HealthResponse(BaseModel):
    backend: str
    database: str
    openai: str
    tavily: str
    semantic_scholar: str
