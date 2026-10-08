from typing import Dict, Any, List

def calculate_actionable_bottleneck(career: Dict[str, Any]) -> Dict[str, str]:
    """Determine the largest actionable bottleneck from existing PRISM factors."""
    skill_match = career.get("student_fit", 0) # Fallback to student_fit if skill_match not available
    financial_fit = career.get("financial_fit", 0)
    conflict_level = career.get("conflict_level", "None").lower()
    
    # Analyze warnings for critical constraints
    warnings = career.get("warnings", [])
    
    financial_gap_warning = next((w for w in warnings if w.get("type") == "financial_gap"), None)
    aptitude_gap_warning = next((w for w in warnings if w.get("type") == "interest_aptitude_gap"), None)
    
    if financial_gap_warning and financial_gap_warning.get("severity") == "High":
        return {
            "bottleneck": "Financial Feasibility",
            "reason": f"Education budget constraint (Gap: INR {financial_gap_warning.get('cost_gap', 0)}).",
            "action": "Focus on highly affordable local pathways or prioritize acquiring merit-based scholarships.",
            "impact": "Resolving this constraint opens access to the primary required degree programs."
        }
        
    if aptitude_gap_warning or skill_match < 60:
        # Check skill gaps to give specific advice
        skill_gaps = career.get("skill_gaps", [])
        top_gap = skill_gaps[0]["skill_name"] if skill_gaps else "technical foundations"
        return {
            "bottleneck": "Technical/Skill Readiness",
            "reason": "Current academic and technical readiness is the largest actionable constraint.",
            "action": f"Prioritize practical project building and foundational learning in {top_gap}.",
            "impact": "Improving this directly increases your academic alignment and market competitiveness."
        }
        
    if conflict_level == "high":
        return {
            "bottleneck": "Interest vs Reality Conflict",
            "reason": "There is a mismatch between high interest and current readiness/financials.",
            "action": "Consider lower-cost entry paths or intensive foundational bootcamps before full degree commitment.",
            "impact": "Aligns expectations with realistic achievable pathways."
        }
        
    return {
        "bottleneck": "Practical Experience",
        "reason": "Foundations and financials are aligned.",
        "action": "Focus on building real-world projects and seeking early internships.",
        "impact": "Differentiates your profile for top market opportunities."
    }


def build_what_would_it_take(career: Dict[str, Any]) -> Dict[str, Any]:
    """Build the 'What would it take?' structural path."""
    skill_gaps = career.get("skill_gaps", [])
    top_skills_needed = [g["skill_name"] for g in skill_gaps[:3]]
    
    if not top_skills_needed:
        required_improvement = "Maintain current strong academic trajectory."
    else:
        required_improvement = f"Address skill gaps in {', '.join(top_skills_needed)}."
        
    return {
        "current_readiness_score": career.get("student_fit", 0),
        "gaps": "Technical/practical skill gap" if skill_gaps else "Experience gap",
        "required_improvement": required_improvement,
        "achievable_path": "Use targeted roadmap and course mapping to build required competencies."
    }

def optimize_career_path(career: Dict[str, Any], parent_profile: Dict[str, Any], student_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Identify the most achievable path based on constraints."""
    budget = parent_profile.get("education_budget", 0) if parent_profile else 0
    estimated_cost = career.get("estimated_cost", 0)
    location = student_profile.get("location", "Unknown")
    
    paths = [
        {"name": "Traditional", "desc": "Standard higher education degree \u2192 specialization \u2192 internship"},
        {"name": "Cost-Optimized", "desc": "Affordable degree/certification \u2192 targeted technical learning \u2192 portfolio"},
        {"name": "Location-First", "desc": f"Local education in {location} \u2192 remote/online specialization \u2192 local/remote work"}
    ]
    
    recommended = paths[0]
    reasons = []
    
    if estimated_cost > budget > 0:
        recommended = paths[1]
        reasons = [
            "Addresses strict financial budget constraints.",
            "Focuses on skill-building rather than expensive signaling."
        ]
    elif budget == 0 or estimated_cost == 0:
        # Data insufficient to make strict financial optimization
        reasons = ["PRISM can identify the most suitable pathway direction, but detailed institution-level optimization requires additional verified data."]
    else:
        reasons = [
            "Financial feasibility supports traditional comprehensive education.",
            "Maximizes foundational depth and market networking."
        ]
        
    return {
        "recommended_path": recommended["name"],
        "path_description": recommended["desc"],
        "why": reasons
    }

def build_career_resilience(career: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate career resilience qualitative stability under student constraints."""
    conflict_level = str(career.get("conflict_level", "None")).lower()
    financial_fit = float(career.get("financial_fit", 100) or 0)
    student_fit = float(career.get("student_fit", 100) or 0)
    
    if conflict_level == "high" or financial_fit < 40:
        return {
            "resilience": "LOW",
            "explanation": "The recommendation is sensitive to financial, location, or prerequisite constraints, requiring proactive gap mitigation."
        }
    elif conflict_level == "medium" or student_fit < 55 or financial_fit < 70:
        return {
            "resilience": "MODERATE",
            "explanation": "The recommendation is moderately sensitive to skill acquisition pace and educational funding stability."
        }
    else:
        return {
            "resilience": "HIGH",
            "explanation": "The recommendation remains relatively stable under the student's current constraints."
        }

def build_decision_summary(career: Dict[str, Any], bottleneck: Dict[str, str], path: Dict[str, Any], resilience: Dict[str, Any]) -> Dict[str, Any]:
    """Create the final executive decision summary."""
    confidence = "HIGH"
    if str(career.get("conflict_level", "None")).lower() == "high":
        confidence = "LOW"
    elif str(career.get("conflict_level", "None")).lower() == "medium" or float(career.get("student_fit", 0) or 0) < 50:
        confidence = "MEDIUM"
        
    confidence_reason = (
        "The recommendation is supported by multiple strong signals across academics, interest, and market demand."
        if confidence == "HIGH"
        else "The career direction is promising, but notable skill or prerequisite gaps require validation."
        if confidence == "MEDIUM"
        else "Important constraints or conflicting signals reduce confidence; preparatory steps advised."
    )
        
    return {
        "career_name": career.get("career_name"),
        "reality_score": career.get("final_score", 0),
        "why_recommended": career.get("why_recommended", "Strong alignment."),
        "biggest_constraint": bottleneck["bottleneck"],
        "highest_impact_action": bottleneck["action"],
        "financial_reality": career.get("affordability_status", "Unknown"),
        "path_optimization": path["recommended_path"],
        "decision_confidence": confidence,
        "confidence_reason": confidence_reason,
        "career_resilience": resilience["resilience"],
        "resilience_explanation": resilience["explanation"]
    }

def enrich_ai_result_with_decision_intelligence(ai_result: Dict[str, Any], student_profile: Dict[str, Any], parent_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Inject decision intelligence safely into the AI result without modifying existing scoring."""
    if "ranked_careers" not in ai_result:
        return ai_result
        
    for career in ai_result["ranked_careers"]:
        bottleneck = calculate_actionable_bottleneck(career)
        wwit = build_what_would_it_take(career)
        path = optimize_career_path(career, parent_profile, student_profile)
        resilience = build_career_resilience(career)
        summary = build_decision_summary(career, bottleneck, path, resilience)
        
        career["decision_intelligence"] = {
            "what_would_it_take": wwit,
            "highest_impact_action": bottleneck,
            "path_optimization": path,
            "career_resilience": resilience,
            "decision_summary": summary
        }
        
    return ai_result
