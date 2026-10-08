"""
demo.py — Isolated Demo Mode Route for Hackathon Demonstrations
Provides safe, unauthenticated analysis using existing PRISM AI scoring engine.
Does not touch MongoDB or expose real user data.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
import sys
import os

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.append(root_dir)

try:
    from ai_engine.pipeline import run_prism_analysis
except ImportError:
    run_prism_analysis = None

from services.decision_intelligence import enrich_ai_result_with_decision_intelligence
from routes.analyze import map_to_ai_profile

router = APIRouter(prefix="/demo", tags=["Demo Mode"])

class DemoAnalyzeRequest(BaseModel):
    student: Dict[str, Any]
    parent: Optional[Dict[str, Any]] = None
    assessment: Optional[Dict[str, Any]] = None

@router.post("/analyze")
def demo_analyze(request: DemoAnalyzeRequest) -> Dict[str, Any]:
    if not run_prism_analysis:
        raise HTTPException(status_code=500, detail="AI Engine module not available")

    student_dict = request.student
    assessment_dict = request.assessment or {}
    parent_dict = request.parent or {}

    profile = map_to_ai_profile(student_dict, assessment_dict)
    
    # Run genuine PRISM scoring engine without writing to MongoDB
    result = run_prism_analysis(student_profile=profile, parent_profile=parent_dict)
    result = enrich_ai_result_with_decision_intelligence(result, profile, parent_dict)

    return {
        "status": "success",
        "demo": True,
        "ai_result": result
    }

class DemoSimulateRequest(BaseModel):
    student: Dict[str, Any]
    parent: Optional[Dict[str, Any]] = None
    assessment: Optional[Dict[str, Any]] = None
    overrides: Dict[str, Any]

@router.post("/simulate")
def demo_simulate(request: DemoSimulateRequest) -> Dict[str, Any]:
    if not run_prism_analysis:
        raise HTTPException(status_code=500, detail="AI Engine module not available")

    student_dict = request.student
    assessment_dict = request.assessment or {}
    parent_dict = dict(request.parent or {})

    profile = map_to_ai_profile(student_dict, assessment_dict)

    overrides = request.overrides
    if "coding" in overrides:
        profile.setdefault("skills", {})["coding"] = float(overrides["coding"])
    if "maths" in overrides:
        profile.setdefault("academic_scores", {})["maths"] = float(overrides["maths"])
    if "education_budget" in overrides and parent_dict:
        parent_dict["education_budget"] = float(overrides["education_budget"])

    # Run genuine PRISM What-If simulation without writing to MongoDB
    result = run_prism_analysis(student_profile=profile, parent_profile=parent_dict)
    result = enrich_ai_result_with_decision_intelligence(result, profile, parent_dict)

    return {
        "status": "success",
        "simulated": True,
        "demo": True,
        "ai_result": result
    }
