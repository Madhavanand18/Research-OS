import pytest
from app.db.database import Base, engine, SessionLocal
from app.models.models import ResearchProject, Source
from app.schemas.schemas import ResearchCreateRequest, ClaimOut, StatisticOut
from app.services.tavily_service import normalize_url

def test_database_initialization():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        assert db is not None
    finally:
        db.close()

def test_source_url_deduplication_normalization():
    url1 = "https://www.example.com/research/paper/"
    url2 = "https://example.com/research/paper"
    assert normalize_url(url1) == normalize_url(url2)
    assert normalize_url("HTTP://EXAMPLE.COM/DOC?foo=bar#section") == "http://example.com/doc?foo=bar"

def test_pydantic_schemas():
    req = ResearchCreateRequest(research_question="What is the future of quantum computing?")
    assert req.depth == "comprehensive"
    assert req.options["include_statistics"] is True

    claim = ClaimOut(
        id="c1",
        claim_text="AI increases productivity",
        confidence=0.92,
        is_disputed=False
    )
    assert claim.confidence == 0.92

    stat = StatisticOut(
        id="s1",
        metric="Growth Rate",
        value=24.5,
        unit="percent",
        confidence=0.95
    )
    assert stat.value == 24.5

def test_health_endpoint():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["backend"] == "OK"
    assert data["database"] == "OK"
