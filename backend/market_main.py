"""
market_main.py — Jaishwa's Career & Job Market Intelligence API
PRISM Engine — Module: Career & Job Market Intelligence
Run standalone: uvicorn backend.market_main:app --port 8001
"""

import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARKET_DATA_DIR = os.path.join(BASE_DIR, "market_career")

# ── Data Loader ───────────────────────────────────────────────────────────────
def _load(filename: str):
    path = os.path.join(MARKET_DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="PRISM Market Intelligence API",
    description="Career & Job Market Intelligence endpoints — Jaishwa's module",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",
                   "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "PRISM Market Intelligence API is running", "module": "Career & Job Market Intelligence"}

@app.get("/api/market/careers")
def get_careers(
    category: Optional[str] = None,
    min_demand: Optional[int] = None,
    city: Optional[str] = None,
):
    """Return all careers, with optional filters."""
    data = _load("careers.json")
    careers = data.get("careers", [])

    if category:
        careers = [c for c in careers if c.get("category", "").lower() == category.lower()]
    if min_demand:
        careers = [c for c in careers if c.get("market_demand_score", 0) >= min_demand]
    if city:
        careers = [
            c for c in careers
            if city.lower() in {loc.get("city", "").lower() for loc in c.get("top_hiring_locations", [])}
        ]

    return {"count": len(careers), "careers": careers}


@app.get("/api/market/careers/{career_id}")
def get_career_by_id(career_id: str):
    """Return a single career by ID."""
    data = _load("careers.json")
    careers = data.get("careers", [])
    career = next((c for c in careers if c.get("career_id") == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found")
    return career


@app.get("/api/market/locations")
def get_locations():
    """Return all regional hub profiles."""
    data = _load("locations.json")
    return data


@app.get("/api/market/trends")
def get_trends():
    """Return macro STEAM market trends."""
    data = _load("market_trends.json")
    return data


@app.get("/api/market/compare")
def compare_careers(ids: str):
    """Compare multiple careers by comma-separated IDs. Example: ?ids=software_engineer,data_scientist"""
    id_list = [i.strip() for i in ids.split(",") if i.strip()]
    if len(id_list) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 career IDs separated by commas.")

    data = _load("careers.json")
    careers = data.get("careers", [])
    result = [c for c in careers if c.get("career_id") in id_list]

    found_ids = {c.get("career_id") for c in result}
    missing = [i for i in id_list if i not in found_ids]
    if missing:
        raise HTTPException(status_code=404, detail=f"Careers not found: {missing}")

    return {"count": len(result), "comparison": result}


@app.get("/api/market/recommendation-insights/{career_id}")
def recommendation_insights(career_id: str, city: Optional[str] = None):
    """Return natural-language market insight for a career (used by PRISM AI engine)."""
    import sys
    import os
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if BASE_DIR not in sys.path:
        sys.path.append(BASE_DIR)
    from ai_engine.market_fit_evaluator import evaluate_market_fit
    result = evaluate_market_fit(career_id=career_id, target_city=city)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
