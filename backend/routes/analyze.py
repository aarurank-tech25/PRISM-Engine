from fastapi import APIRouter, HTTPException, Depends
from dependencies.auth import get_current_user, verify_student_ownership
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.db_service import student_service, assessment_service, parent_service
import sys
import os

# Ensure ai_engine is importable
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.append(root_dir)

try:
    from ai_engine.pipeline import run_prism_analysis
except ImportError:
    run_prism_analysis = None

router = APIRouter(prefix="/analyze", tags=["Analyze"])

class AnalyzeRequest(BaseModel):
    student_id: str
    assessment_id: str
    parent_id: Optional[str] = None

def map_to_ai_profile(student: Dict[str, Any], assessment: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    # Maps backend models to AI engine StudentProfile expectations
    profile = {
        "name": student.get("name", "Unknown"),
        "age": student.get("age", 18),
        "education_level": student.get("grade", "High School"),
        "location": student.get("location", "India"), # Ensure location exists
        "academic_scores": {},
        "skills": {},
        "interests": {},
        "aptitude": {},
        "personality": {},
        "career_preferences": []
    }
    
    # Base student interests
    for interest in student.get("interests", []):
        profile["interests"][interest] = 80.0
        
    # Assessment overrides
    if assessment:
        profile["academic_scores"].update(assessment.get("academic_scores", {}))
        profile["skills"].update(assessment.get("skills", {}))
        profile["interests"].update(assessment.get("interests", {}))
        profile["aptitude"].update(assessment.get("aptitude", {}))
        profile["personality"].update(assessment.get("personality", {}))
        profile["career_preferences"] = assessment.get("career_preferences", [])
        
    return profile

@router.post("/")
def analyze_student(request: AnalyzeRequest, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if not run_prism_analysis:
        raise HTTPException(status_code=500, detail="AI Engine module not found or failed to load")
        
    # Prevent IDOR: Check ownership if it's not the 'demo' bypass (handled carefully)
    if request.student_id != "demo":
        verify_student_ownership(request.student_id, current_user)
        
    # Get student from DB
    student = student_service.get_by_id(request.student_id)
        
    if not student:
        # For testing, if 'demo' student isn't seeded yet, create it on the fly
        if request.student_id == "demo":
            student = {
                "name": "Demo Student",
                "age": 18,
                "grade": "12th Grade",
                "location": "Coimbatore",
                "interests": ["Technology", "Coding"],
                "_id": "demo"
            }
            student_service._memory_store["demo"] = student
        else:
            raise HTTPException(status_code=404, detail="Student not found")
            
    # Get assessment from DB
    assessment = None
    if request.assessment_id:
        assessment = assessment_service.get_by_id(request.assessment_id)
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
    
    parent = None
    if request.parent_id:
        parent = parent_service.get_by_id(request.parent_id)
        
    try:
        # Create AI-compatible payload
        student_profile_dict = map_to_ai_profile(student, assessment)
        
        # Convert _id to string for JSON serialization
        if parent:
            parent["_id"] = str(parent.get("_id", request.parent_id))
            
        result = run_prism_analysis(student_profile=student_profile_dict, parent_profile=parent)
        
        # Inject PRISM Decision Intelligence Layer
        from services.decision_intelligence import enrich_ai_result_with_decision_intelligence
        result = enrich_ai_result_with_decision_intelligence(result, student_profile_dict, parent)
        
        return {
            "status": "success",
            "student_id": request.student_id,
            "assessment_id": request.assessment_id,
            "ai_result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")

class SimulateRequest(BaseModel):
    student_id: str
    assessment_id: str
    parent_id: Optional[str] = None
    overrides: Dict[str, Any]

@router.post("/simulate")
def simulate_analysis(request: SimulateRequest, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if not run_prism_analysis:
        raise HTTPException(status_code=500, detail="AI Engine module not found or failed to load")
        
    if request.student_id != "demo":
        verify_student_ownership(request.student_id, current_user)
        
    student = student_service.get_by_id(request.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    assessment = assessment_service.get_by_id(request.assessment_id) if request.assessment_id else None
    parent = parent_service.get_by_id(request.parent_id) if request.parent_id else None
    
    try:
        # Create temporary AI-compatible payload
        student_profile_dict = map_to_ai_profile(student, assessment)
        
        # Apply overrides safely
        overrides = request.overrides
        if "coding" in overrides:
            student_profile_dict["skills"]["coding"] = float(overrides["coding"])
        if "maths" in overrides:
            student_profile_dict["academic_scores"]["maths"] = float(overrides["maths"])
        if "education_budget" in overrides and parent:
            parent["education_budget"] = float(overrides["education_budget"])
            
        if parent:
            parent["_id"] = str(parent.get("_id", request.parent_id))
            
        # Run PRISM without modifying DB
        result = run_prism_analysis(student_profile=student_profile_dict, parent_profile=parent)
        
        # Inject PRISM Decision Intelligence Layer
        from services.decision_intelligence import enrich_ai_result_with_decision_intelligence
        result = enrich_ai_result_with_decision_intelligence(result, student_profile_dict, parent)
        
        return {
            "status": "success",
            "simulated": True,
            "ai_result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation Error: {str(e)}")

