from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.core.config import settings
from app.db.database import Base, engine
from app.api.endpoints import router as api_router

# Initialize SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ResearchOS API",
    description="AI-Powered Research Intelligence Platform",
    version="1.0.0"
)

# CORS middleware for Next.js communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "name": "ResearchOS API",
        "status": "online",
        "docs": "/docs"
    }
