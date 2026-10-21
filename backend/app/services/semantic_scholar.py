import logging
from typing import Dict, Any, List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class SemanticScholarService:
    def __init__(self):
        self.api_key = settings.semantic_scholar_api_key
        self.base_url = "https://api.semanticscholar.org/graph/v1"

    @property
    def is_configured(self) -> bool:
        # Semantic Scholar can work without an API key with public rate limits, but works better with key
        return True

    async def search_papers(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Searches academic papers on Semantic Scholar."""
        headers = {}
        if self.api_key and len(self.api_key.strip()) > 5:
            headers["x-api-key"] = self.api_key

        params = {
            "query": query,
            "limit": limit,
            "fields": "paperId,title,abstract,authors,year,venue,citationCount,url,externalIds,fieldsOfStudy"
        }

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.get(f"{self.base_url}/paper/search", params=params, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    return data.get("data", [])
                else:
                    logger.warning(f"Semantic Scholar returned status {res.status_code}")
                    return []
        except Exception as e:
            logger.error(f"Semantic Scholar search error: {e}")
            return []

semantic_scholar_service = SemanticScholarService()
