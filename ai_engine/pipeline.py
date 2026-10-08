"""PRISM AI - Main Execution Pipeline.

Purpose:
--------
Orchestrates the complete end-to-end PRISM career analysis pipeline:
Student & Parent Inputs
    ↓
Normalize Data / Validate Schemas
    ↓
Student Fit Calculation
    ↓
Parent / Financial Fit Calculation
    ↓
Conflict & Trade-off Analysis
    ↓
Market Fit Calculation
    ↓
Multi-Dimensional Career Scoring
    ↓
Skill Gap Prioritization
    ↓
Career Ranking
    ↓
Explainable Recommendation Synthesis & JSON Serialization
"""

import json
from typing import Any, Dict, List

from .career_matcher import CareerMatcher
from .conflict import ConflictDetector
from .normalization import (
    normalize_parent_profile,
    normalize_student_profile,
)
from .recommendation import RecommendationEngine
from .schemas import ParentProfile, StudentProfile
from .scoring import ScoringEngine


def serialize_prism_result(result: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a PRISM analysis result into a clean, JSON-serializable dictionary

    strictly conforming to the backend integration contract.
    """
    if not isinstance(result, dict):
        return {}

    raw_summary = result.get("summary", {})
    raw_conflict = result.get("conflict_analysis", {})
    raw_ranked = result.get("ranked_careers", [])

    # Format contract-compliant summary
    summary = {
        "student_name": str(raw_summary.get("student_name", "Student")),
        "evaluated_careers": int(
            raw_summary.get("evaluated_careers")
            or raw_summary.get("evaluated_careers_count")
            or 0
        ),
        "top_career": str(raw_summary.get("top_career", "N/A")),
        "top_score": float(raw_summary.get("top_score", 0.0)),
        "financial_feasibility": str(
            raw_summary.get("financial_feasibility")
            or raw_summary.get("financial_feasibility_summary")
            or "Unknown"
        ),
        "conflict_level": str(
            raw_summary.get("conflict_level")
            or raw_summary.get("overall_parent_student_conflict")
            or "Low"
        ),
        # Backward-compatibility aliases
        "evaluated_careers_count": int(
            raw_summary.get("evaluated_careers")
            or raw_summary.get("evaluated_careers_count")
            or 0
        ),
        "financial_feasibility_summary": str(
            raw_summary.get("financial_feasibility")
            or raw_summary.get("financial_feasibility_summary")
            or "Unknown"
        ),
        "overall_parent_student_conflict": str(
            raw_summary.get("conflict_level")
            or raw_summary.get("overall_parent_student_conflict")
            or "Low"
        ),
    }

    # Format contract-compliant conflict analysis
    pref_conflict = raw_conflict.get("preference_conflict", {})
    conflict_index = float(
        raw_conflict.get("index")
        if "index" in raw_conflict
        else pref_conflict.get("conflict_score", 0.0)
    )
    conflict_level = str(
        raw_conflict.get("level")
        if "level" in raw_conflict
        else pref_conflict.get("conflict_level", "Low")
    )

    # Flatten structured warnings
    all_warnings: List[Dict[str, Any]] = []
    if "warnings" in raw_conflict and isinstance(raw_conflict["warnings"], list):
        all_warnings = raw_conflict["warnings"]
    else:
        for apt_w in raw_conflict.get("interest_aptitude_gaps", []):
            all_warnings.append(apt_w)

    conflict_analysis = {
        "index": conflict_index,
        "level": conflict_level,
        "warnings": all_warnings,
        # Backward-compatibility aliases
        "preference_conflict": pref_conflict,
        "interest_aptitude_gaps": raw_conflict.get("interest_aptitude_gaps", []),
        "overall_conflict_level": conflict_level,
    }

    # Format contract-compliant ranked careers
    ranked_careers: List[Dict[str, Any]] = []
    for idx, career in enumerate(raw_ranked, 1):
        if not isinstance(career, dict):
            continue

        career_entry = {
            "rank": int(career.get("rank", idx)),
            "career_name": str(career.get("career_name", "Unknown")),
            "final_score": float(career.get("final_score", 0.0)),
            "student_fit": float(career.get("student_fit", 0.0)),
            "financial_fit": float(career.get("financial_fit", 0.0)),
            "market_fit": float(career.get("market_fit", 0.0)),
            "preference_match": float(career.get("preference_match", 0.0)),
            "affordability_status": str(career.get("affordability_status", "Affordable")),
            "conflict_level": str(career.get("conflict_level", "Low")),
            "skill_gaps": career.get("skill_gaps", []),
            "strengths": career.get("strengths", []),
            "warnings": career.get("warnings", []),
            "why_recommended": str(career.get("why_recommended", "")),
            "next_steps": career.get("next_steps", []),
            "alternative_careers": career.get("alternative_careers", []),
        }
        ranked_careers.append(career_entry)

    serialized = {
        "summary": summary,
        "conflict_analysis": conflict_analysis,
        "ranked_careers": ranked_careers,
    }

    # Verify JSON compatibility
    json.dumps(serialized)
    return serialized


def run_prism_analysis(
    student_profile: Dict[str, Any] | StudentProfile | None,
    parent_profile: Dict[str, Any] | ParentProfile | None = None,
    top_k: int = 5,
) -> Dict[str, Any]:
    """Execute the full end-to-end PRISM evaluation pipeline.

    Args:
        student_profile: Student assessment profile (dict or StudentProfile).
        parent_profile: Family financial & preferences profile (dict or ParentProfile).
        top_k: Number of top recommended careers to return (default 5).

    Returns:
        Structured, backend-ready JSON-serializable dictionary.
    """
    # 1. Normalize Inputs
    if isinstance(student_profile, StudentProfile):
        norm_student = student_profile.to_dict()
    else:
        norm_student = normalize_student_profile(student_profile)

    if isinstance(parent_profile, ParentProfile):
        norm_parent = parent_profile.to_dict()
    else:
        norm_parent = normalize_parent_profile(parent_profile)

    # 2. Initialize engines
    scoring_engine = ScoringEngine()
    conflict_detector = ConflictDetector()
    matcher = CareerMatcher(scoring_engine=scoring_engine, conflict_detector=conflict_detector)
    rec_engine = RecommendationEngine()

    # 3. Evaluate and rank all careers
    all_evaluated = matcher.evaluate_all(norm_student, norm_parent)

    # 4. Global Parent-Student Conflict Analysis
    pref_conflict = conflict_detector.calculate_preference_conflict(
        norm_student.get("career_preferences", []),
        norm_parent.get("parent_career_preferences", []),
    )
    apt_conflicts = conflict_detector.detect_interest_aptitude_conflicts(
        norm_student.get("interests", {}),
        norm_student.get("aptitude", {}),
        norm_student.get("academic_scores", {}),
    )

    # 5. Format top recommendations
    top_evaluated = all_evaluated[:top_k]
    ranked_recommendations = []
    for idx, eval_item in enumerate(top_evaluated, 1):
        rec_data = rec_engine.format_career_recommendation(
            evaluated_career=eval_item,
            student_profile=norm_student,
            all_evaluated_careers=all_evaluated,
        )
        rec_data["rank"] = idx
        ranked_recommendations.append(rec_data)

    # 6. Overall Summary
    top_career_name = ranked_recommendations[0]["career_name"] if ranked_recommendations else "N/A"
    top_score = ranked_recommendations[0]["final_score"] if ranked_recommendations else 0.0
    top_affordability = (
        ranked_recommendations[0]["affordability_status"] if ranked_recommendations else "N/A"
    )

    raw_result = {
        "summary": {
            "student_name": norm_student.get("name", "Student"),
            "evaluated_careers": len(all_evaluated),
            "top_career": top_career_name,
            "top_score": top_score,
            "financial_feasibility": top_affordability,
            "conflict_level": pref_conflict["conflict_level"],
            # Backward-compatibility aliases
            "evaluated_careers_count": len(all_evaluated),
            "financial_feasibility_summary": top_affordability,
            "overall_parent_student_conflict": pref_conflict["conflict_level"],
        },
        "conflict_analysis": {
            "index": pref_conflict["conflict_score"],
            "level": pref_conflict["conflict_level"],
            "warnings": apt_conflicts,
            # Backward-compatibility aliases
            "preference_conflict": pref_conflict,
            "interest_aptitude_gaps": apt_conflicts,
            "overall_conflict_level": pref_conflict["conflict_level"],
        },
        "ranked_careers": ranked_recommendations,
    }

    return serialize_prism_result(raw_result)
