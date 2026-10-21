import logging
from typing import Dict, Any, List, Optional
import httpx
from urllib.parse import urlparse, parse_qsl, urlencode
from app.core.config import settings

logger = logging.getLogger(__name__)

def normalize_url(url: str) -> str:
    """Normalizes URL by lowering scheme and host, stripping www, trimming path, and removing fragments and tracking params."""
    try:
        parsed = urlparse(url.strip())
        scheme = parsed.scheme.lower()
        netloc = parsed.netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        path = parsed.path.lower().rstrip("/")
        
        # filter out common tracking params
        query_params = parse_qsl(parsed.query)
        filtered_params = [
            (k, v) for k, v in query_params
            if not k.lower().startswith("utm_") and k.lower() not in ("fbclid", "gclid", "ref")
        ]
        query_str = f"?{urlencode(filtered_params)}" if filtered_params else ""
        return f"{scheme}://{netloc}{path}{query_str}"
    except Exception:
        return url.strip().lower()

class TavilyService:
    def __init__(self):
        self.api_key = settings.tavily_api_key
        self.search_url = "https://api.tavily.com/search"
        self.extract_url = "https://api.tavily.com/extract"

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def search(
        self,
        query: str,
        search_depth: str = "basic",
        max_results: int = 7,
        include_images: bool = True
    ) -> Dict[str, Any]:
        """Performs Tavily live internet web search."""
        if not self.is_configured:
            return {"results": [], "images": []}

        payload = {
            "api_key": self.api_key,
            "query": query,
            "search_depth": search_depth,
            "max_results": max_results,
            "include_images": include_images,
            "include_answer": False
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(self.search_url, json=payload)
                res.raise_for_status()
                return res.json()
        except Exception as e:
            logger.error(f"Tavily search error for '{query}': {e}")
            return {"results": [], "images": []}

    async def extract(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Extracts content from high-value URLs using Tavily Extract."""
        if not self.is_configured or not urls:
            return []

        payload = {
            "api_key": self.api_key,
            "urls": urls[:5]
        }

        try:
            async with httpx.AsyncClient(timeout=40.0) as client:
                res = await client.post(self.extract_url, json=payload)
                res.raise_for_status()
                data = res.json()
                return data.get("results", [])
        except Exception as e:
            logger.error(f"Tavily extract error: {e}")
            return []

tavily_service = TavilyService()
