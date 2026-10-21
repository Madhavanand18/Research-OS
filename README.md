# ResearchOS: AI-Powered Research Intelligence Platform

ResearchOS is an autonomous research intelligence engine. Given any investigation question, it plans multidimensional inquiries, retrieves live internet data via Tavily, queries academic literature via Semantic Scholar, extracts structured claims, evidence units, numerical statistics, and entities, detects empirical contradictions and research gaps, plots verified charts, creates knowledge graphs, and synthesizes executive cited reports in real-time.

---

## Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, React Flow, Lucide Icons
- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, SQLite
- **Intelligence & Search**:
  - OpenAI Responses / Structured JSON completions
  - Tavily Search & Tavily Extract API
  - Semantic Scholar Academic Graph API
- **Live Streaming**: Server-Sent Events (SSE)

---

## Requirements

- Python 3.11+
- Node.js 18+ (LTS recommended)
- Optional API Keys: OpenAI API Key, Tavily API Key, Semantic Scholar API Key

---

## Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
TAVILY_API_KEY=your_tavily_key
SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_key

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

*Note: If no keys are provided, ResearchOS gracefully activates a clearly labeled `LOCAL DEMO DATA — NOT LIVE RESEARCH` mode for UI testing.*

---

## Quickstart

### 1. Backend Setup
From the root directory:
```bash
cd backend
py -3.13 -m pip install fastapi uvicorn pydantic sqlalchemy httpx python-dotenv pytest
py -3.13 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend API will be accessible at `http://localhost:8000` (docs at `http://localhost:8000/docs`).

### 2. Frontend Setup
From another terminal in the root directory:
```bash
cd frontend
npm run dev
```
Frontend interface will be running at `http://localhost:3000`.

---

## Live Demo Flow

1. Open `http://localhost:3000`.
2. Enter any research query (or accept default: *"What will be the impact of artificial intelligence on employment in India by 2035?"*).
3. Select depth (`Comprehensive`) and click **START RESEARCH**.
4. Watch the live 3-column workspace update via Server-Sent Events (Planning → Web Discovery → Academic Discovery → Extraction → Synthesis).
5. Switch to **Dashboard** to view verified statistics charts and contradiction analysis.
6. Open **Sources** to filter and inspect web sources and papers.
7. Open **Knowledge** to explore interactive React Flow entity graphs.
8. Ask direct queries to the collected body of facts under **Ask the Research**.
9. View or export the executive report with **Print** or **Copy Markdown**.

---

## Running Automated Tests

Run backend integration and schema verification tests:
```bash
cd backend
py -3.13 -m pytest tests/
```
