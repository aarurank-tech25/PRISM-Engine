"""PRISM AI - Career Matcher.

Purpose:
--------
Loads career benchmark data from JSON, evaluates all candidate pathways across
student fit, financial feasibility, market demand, and parent-student conflicts,
and ranks the top matches.
"""

import json
from pathlib import Path
from typing import Any, Dict, List

from .conflict import ConflictDetector
from .normalization import (
    normalize_parent_profile,
    normalize_student_profile,
)
from .scoring import ScoringEngine


class CareerMatcher:
    """Evaluates and ranks careers against student and family profiles."""

    def __init__(
        self,
        data_path: str | Path | None = None,
        scoring_engine: ScoringEngine | None = None,
        conflict_detector: ConflictDetector | None = None,
    ) -> None:
        """Initialize the career matcher with paths and engine dependencies."""
        if data_path:
            self.data_path = Path(data_path)
        else:
            # Default to data/careers.json relative to repository root
            default_path = Path(__file__).resolve().parent.parent / "data" / "careers.json"
            self.data_path = default_path

        self.scoring_engine = scoring_engine or ScoringEngine()
        self.conflict_detector = conflict_detector or ConflictDetector()
        self.careers: List[Dict[str, Any]] = []

    def load_careers(self, file_path: str | Path | None = None) -> List[Dict[str, Any]]:
        """Load and parse career profiles from JSON file."""
        target_path = Path(file_path) if file_path else self.data_path
        if not target_path or not target_path.exists():
            return []

        with open(target_path, "r", encoding="utf-8") as f:
            self.careers = json.load(f)
        return self.careers

    def evaluate_career(
        self,
        career: Dict[str, Any],
        student_profile: Dict[str, Any],
        parent_profile: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Compute all dimensional scores and conflict warnings for a single career."""
        # 1. Student Fit (skills, aptitude, interests, personality)
        student_fit_res = self.scoring_engine.calculate_student_fit(student_profile, career)

        # 2. Financial Fit
        financial_fit_res = self.scoring_engine.calculate_financial_fit(parent_profile, career)

        # 3. Market Fit
        market_fit_res = self.scoring_engine.calculate_market_fit(
            career,
            student_location=student_profile.get("location", ""),
            preferred_location=parent_profile.get("preferred_location", ""),
            relocation_allowed=parent_profile.get("relocation_allowed", True),
        )

        # 4. Explicit Preference Match
        career_name = career.get("career_name", "Unknown Career")
        pref_match = self.scoring_engine.calculate_preference_match(
            student_profile.get("career_preferences", []),
            career_name,
        )

        # 5. Composite Final Score
        final_score = self.scoring_engine.calculate_overall_career_score(
            student_fit=student_fit_res["student_fit"],
            financial_fit=financial_fit_res["financial_fit"],
            market_fit=market_fit_res["market_fit"],
            preference_match=pref_match,
        )

        # 6. Conflict Detection for this specific career
        conflict_res = self.conflict_detector.detect_all_conflicts(
            student_profile, parent_profile, career
        )

        return {
            "career_name": career_name,
            "final_score": final_score,
            "student_fit": student_fit_res["student_fit"],
            "skill_match": student_fit_res["skill_match"],
            "aptitude_match": student_fit_res["aptitude_match"],
            "interest_match": student_fit_res["interest_match"],
            "personality_match": student_fit_res["personality_match"],
            "financial_fit": financial_fit_res["financial_fit"],
            "financial_ratio": financial_fit_res["financial_ratio"],
            "estimated_cost": financial_fit_res["estimated_cost"],
            "financial_gap": financial_fit_res["financial_gap"],
            "affordability_status": financial_fit_res["affordability_status"],
            "market_fit": market_fit_res["market_fit"],
            "market_demand": market_fit_res["market_demand"],
            "location_demand": market_fit_res["location_demand"],
            "future_growth": market_fit_res["future_growth"],
            "preference_match": pref_match,
            "conflict_level": conflict_res["overall_conflict_level"],
            "preference_conflict": conflict_res["preference_conflict"],
            "warnings": conflict_res["warnings"],
            "skill_gaps": student_fit_res["skill_gaps"],
            "interest_areas": career.get("interest_areas", []),
            "required_skills": career.get("required_skills", []),
        }

    def match_and_rank(
        self,
        student_profile: Dict[str, Any],
        parent_profile: Dict[str, Any] | None = None,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """Evaluate all careers in dataset, rank descending by score, and return top_k matches.

        Does not eliminate careers solely because they are not in the student's explicit
        preferences, ensuring discovery of unexpected but strong-fit career paths.
        """
        if not self.careers:
            self.load_careers()

        norm_student = normalize_student_profile(student_profile)
        norm_parent = normalize_parent_profile(parent_profile)

        evaluated: List[Dict[str, Any]] = []
        for career in self.careers:
            eval_result = self.evaluate_career(career, norm_student, norm_parent)
            evaluated.append(eval_result)

        # Sort descending by final score
        evaluated.sort(key=lambda item: item["final_score"], reverse=True)

        return evaluated[:top_k]

    def evaluate_all(
        self,
        student_profile: Dict[str, Any],
        parent_profile: Dict[str, Any] | None = None,
    ) -> List[Dict[str, Any]]:
        """Evaluate all careers in dataset and return full sorted list without truncation."""
        if not self.careers:
            self.load_careers()

        norm_student = normalize_student_profile(student_profile)
        norm_parent = normalize_parent_profile(parent_profile)

        evaluated: List[Dict[str, Any]] = []
        for career in self.careers:
            eval_result = self.evaluate_career(career, norm_student, norm_parent)
            evaluated.append(eval_result)

        evaluated.sort(key=lambda item: item["final_score"], reverse=True)
        return evaluated
