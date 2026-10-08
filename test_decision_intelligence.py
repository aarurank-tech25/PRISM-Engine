import json
from backend.services.decision_intelligence import enrich_ai_result_with_decision_intelligence

def run_scenario(name, student_fit, financial_fit, budget, conflict_level, skill_gaps, warnings):
    print(f"=== {name} ===")
    
    # Mock AI Result
    mock_ai_result = {
        "ranked_careers": [
            {
                "career_name": "AI Engineer",
                "final_score": 85.0,
                "student_fit": student_fit,
                "financial_fit": financial_fit,
                "conflict_level": conflict_level,
                "estimated_cost": 200000,
                "skill_gaps": skill_gaps,
                "warnings": warnings,
                "why_recommended": "Strong overall match."
            }
        ]
    }
    
    parent_profile = {"education_budget": budget}
    student_profile = {"location": "Chennai"}
    
    result = enrich_ai_result_with_decision_intelligence(mock_ai_result, student_profile, parent_profile)
    di = result["ranked_careers"][0]["decision_intelligence"]
    
    print(f"Bottleneck: {di['highest_impact_action']['bottleneck']}")
    print(f"Action: {di['highest_impact_action']['action']}")
    print(f"Path Optimization: {di['path_optimization']['recommended_path']}")
    print(f"Decision Confidence: {di['decision_summary']['decision_confidence']}\n")

if __name__ == "__main__":
    # SCENARIO A: High technical interest, High academic readiness, High budget
    run_scenario(
        "SCENARIO A: High Tech, High Academic, High Budget",
        student_fit=90, financial_fit=95, budget=500000, conflict_level="None",
        skill_gaps=[], warnings=[]
    )
    
    # SCENARIO B: High interest, Low technical readiness, Medium budget
    run_scenario(
        "SCENARIO B: High Interest, Low Readiness, Medium Budget",
        student_fit=40, financial_fit=75, budget=250000, conflict_level="Medium",
        skill_gaps=[{"skill_name": "Python", "gap": 50}], 
        warnings=[{"type": "interest_aptitude_gap", "severity": "High"}]
    )
    
    # SCENARIO C: Strong academics, Low budget, No relocation
    run_scenario(
        "SCENARIO C: Strong Academics, Low Budget, No Relocation",
        student_fit=85, financial_fit=30, budget=100000, conflict_level="High",
        skill_gaps=[], 
        warnings=[{"type": "financial_gap", "severity": "High", "cost_gap": 100000}]
    )
    
    # SCENARIO D: Strong technical skills, Low interest
    run_scenario(
        "SCENARIO D: Strong Tech, Low Interest",
        student_fit=85, financial_fit=80, budget=250000, conflict_level="High",
        skill_gaps=[], 
        warnings=[]
    )
