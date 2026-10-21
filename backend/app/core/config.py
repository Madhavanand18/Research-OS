import os

class Settings:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.tavily_api_key = os.getenv("TAVILY_API_KEY", "")
        self.semantic_scholar_api_key = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///./researchos.db")
        self.cors_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "*"
        ]

settings = Settings()
