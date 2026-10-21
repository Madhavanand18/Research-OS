import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.db.database import Base

def utcnow():
    return datetime.datetime.utcnow()

class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    research_question = Column(Text, nullable=False)
    status = Column(String, default="created")  # created, in_progress, completed, failed
    depth = Column(String, default="comprehensive")  # quick, deep, comprehensive
    source_types = Column(JSON, default=list)
    options = Column(JSON, default=dict)
    summary = Column(Text, nullable=True)
    quality_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    runs = relationship("ResearchRun", back_populates="project", cascade="all, delete-orphan")
    queries = relationship("ResearchQuery", back_populates="project", cascade="all, delete-orphan")
    sources = relationship("Source", back_populates="project", cascade="all, delete-orphan")
    academic_papers = relationship("AcademicPaper", back_populates="project", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="project", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="project", cascade="all, delete-orphan")
    statistics = relationship("Statistic", back_populates="project", cascade="all, delete-orphan")
    entities = relationship("Entity", back_populates="project", cascade="all, delete-orphan")
    relationships = relationship("Relationship", back_populates="project", cascade="all, delete-orphan")
    contradictions = relationship("Contradiction", back_populates="project", cascade="all, delete-orphan")
    research_gaps = relationship("ResearchGap", back_populates="project", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEvent", back_populates="project", cascade="all, delete-orphan")
    image_assets = relationship("ImageAsset", back_populates="project", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="project", cascade="all, delete-orphan")
    activity_events = relationship("ActivityEvent", back_populates="project", cascade="all, delete-orphan")


class ResearchRun(Base):
    __tablename__ = "research_runs"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    status = Column(String, default="running")
    current_stage = Column(String, default="planning")
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("ResearchProject", back_populates="runs")


class ResearchQuery(Base):
    __tablename__ = "research_queries"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    query_text = Column(String, nullable=False)
    dimension = Column(String, nullable=True)
    query_type = Column(String, default="web")  # web, academic, followup
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="queries")


class Source(Base):
    __tablename__ = "sources"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    url = Column(String, nullable=False, index=True)
    normalized_url = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    domain = Column(String, nullable=True)
    snippet = Column(Text, nullable=True)
    source_type = Column(String, default="web")  # web, academic, government, news, industry
    relevance_score = Column(Float, default=0.8)
    quality_score = Column(Float, default=0.8)
    published_date = Column(String, nullable=True)
    is_extracted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="sources")
    content = relationship("SourceContent", back_populates="source", uselist=False, cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="source")


class SourceContent(Base):
    __tablename__ = "source_contents"

    id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("sources.id"), nullable=False, unique=True)
    raw_text = Column(Text, nullable=True)
    markdown_text = Column(Text, nullable=True)
    extracted_at = Column(DateTime, default=utcnow)

    source = relationship("Source", back_populates="content")


class AcademicPaper(Base):
    __tablename__ = "academic_papers"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    paper_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    abstract = Column(Text, nullable=True)
    authors = Column(JSON, default=list)
    year = Column(Integer, nullable=True)
    venue = Column(String, nullable=True)
    citation_count = Column(Integer, default=0)
    url = Column(String, nullable=True)
    doi = Column(String, nullable=True)
    fields_of_study = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="academic_papers")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    claim_text = Column(Text, nullable=False)
    topic = Column(String, nullable=True)
    confidence = Column(Float, default=0.85)
    is_disputed = Column(Boolean, default=False)
    supporting_source_ids = Column(JSON, default=list)
    contradicting_source_ids = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="claims")
    evidence = relationship("Evidence", back_populates="claim")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    source_id = Column(String, ForeignKey("sources.id"), nullable=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=True)
    text = Column(Text, nullable=False)
    evidence_type = Column(String, default="finding")  # statistic, finding, statement, forecast, historical_event, comparison
    relevance = Column(Float, default=0.85)
    confidence = Column(Float, default=0.85)
    date = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="evidence")
    source = relationship("Source", back_populates="evidence")
    claim = relationship("Claim", back_populates="evidence")


class Statistic(Base):
    __tablename__ = "statistics"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    source_id = Column(String, ForeignKey("sources.id"), nullable=True)
    metric = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    value_display = Column(String, nullable=True)
    unit = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    date = Column(String, nullable=True)
    geography = Column(String, nullable=True)
    category = Column(String, nullable=True)
    confidence = Column(Float, default=0.9)
    source_title = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="statistics")


class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    name = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)  # organization, company, technology, country, concept, person, industry, event
    description = Column(Text, nullable=True)
    mention_count = Column(Integer, default=1)
    related_claims_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="entities")


class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    source_entity = Column(String, nullable=False)
    target_entity = Column(String, nullable=False)
    relation_type = Column(String, nullable=False)  # affects, developed_by, located_in, influences, studied_by, competes_with, related_to
    description = Column(Text, nullable=True)
    supporting_evidence_ids = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="relationships")


class Contradiction(Base):
    __tablename__ = "contradictions"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    topic = Column(String, nullable=False)
    position_a = Column(Text, nullable=False)
    sources_a = Column(JSON, default=list)
    position_b = Column(Text, nullable=False)
    sources_b = Column(JSON, default=list)
    likely_explanation = Column(Text, nullable=True)
    contradiction_type = Column(String, default="methodology")  # direct, timeframes, populations, definitions, methodology, geography
    confidence = Column(Float, default=0.8)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="contradictions")


class ResearchGap(Base):
    __tablename__ = "research_gaps"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    gap_description = Column(Text, nullable=False)
    category = Column(String, default="missing_coverage")  # weak_evidence, single_source, outdated, missing_geography, missing_industry, unanswered_subquestion
    suggested_query = Column(String, nullable=True)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="research_gaps")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    date = Column(String, nullable=False)
    year = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    source_id = Column(String, ForeignKey("sources.id"), nullable=True)
    source_title = Column(String, nullable=True)
    confidence = Column(Float, default=0.85)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="timeline_events")


class ImageAsset(Base):
    __tablename__ = "image_assets"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    image_url = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    source_title = Column(String, nullable=True)
    caption = Column(Text, nullable=True)
    query = Column(String, nullable=True)
    attribution = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="image_assets")


class Citation(Base):
    __tablename__ = "citations"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    report_id = Column(String, nullable=True)
    citation_number = Column(Integer, nullable=False)
    source_id = Column(String, ForeignKey("sources.id"), nullable=False)
    cited_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    event_type = Column(String, nullable=False)
    stage = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="activity_events")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("research_projects.id"), nullable=False)
    title = Column(String, nullable=False)
    executive_summary = Column(Text, nullable=False)
    methodology = Column(Text, nullable=True)
    scope = Column(Text, nullable=True)
    key_findings = Column(JSON, default=list)
    detailed_analysis = Column(Text, nullable=False)
    conclusion = Column(Text, nullable=False)
    report_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)

    project = relationship("ResearchProject", back_populates="reports")
