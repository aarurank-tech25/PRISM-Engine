"""PRISM AI - Conflict & Trade-off Analyzer.

Purpose:
--------
Identifies real-world friction points and constraints:
1. Parent-Student Career Preference Conflict Index (0-100)
2. Interest vs. Aptitude Gaps (high interest in domain with low foundational aptitude)
3. Financial Feasibility Constraints (budget vs. cost gaps)
4. Geographic & Relocation Constraints (location mismatches when relocation is disallowed)
"""

from typing import Any, Dict, List

from .normalization import (
    clamp_score,
    compute_token_similarity,
    find_best_score_in_dict,
)


class ConflictDetector:
    """Analyzes conflicts, trade-offs, and constraints between student ambitions,

    parent preferences, and career realities.
    """

    def __init__(self, conflict_threshold: float = 40.0) -> None:
        """Initialize the conflict detector."""
        self.conflict_threshold = conflict_threshold

    # -------------------------------------------------------------------------
    # 1. Parent-Student Preference Conflict
    # -------------------------------------------------------------------------
    def calculate_preference_conflict(
        self,
        student_preferences: List[str],
        parent_preferences: List[str],
    ) -> Dict[str, Any]:
        """Calculate deterministic conflict index (0-100) between student and parent preferences.

        Interpretation:
            0-20   -> Very Low
            21-40  -> Low
            41-60  -> Moderate
            61-80  -> High
            81-100 -> Very High
        """
        student_prefs = [p.strip() for p in student_preferences if p and p.strip()]
        parent_prefs = [p.strip() for p in parent_preferences if p and p.strip()]

        if not student_prefs and not parent_prefs:
            return {
                "conflict_score": 0.0,
                "conflict_level": "Very Low",
                "explanation": "No specific career preferences declared by student or parents.",
            }

        if not student_prefs or not parent_prefs:
            return {
                "conflict_score": 25.0,
                "conflict_level": "Low",
                "explanation": "Only one party declared specific career preferences; minimal friction anticipated.",
            }

        # Calculate maximum pair-wise similarity across student and parent preferences
        max_sim = 0.0
        best_student_pref = student_prefs[0]
        best_parent_pref = parent_prefs[0]

        for s_pref in student_prefs:
            for p_pref in parent_prefs:
                sim = compute_token_similarity(s_pref, p_pref)
                if sim > max_sim:
                    max_sim = sim
                    best_student_pref = s_pref
                    best_parent_pref = p_pref

        # Conflict is inverse of maximum alignment
        raw_conflict = (1.0 - max_sim) * 100.0
        conflict_score = round(max(0.0, min(100.0, raw_conflict)), 2)

        if conflict_score <= 20.0:
            level = "Very Low"
            explanation = f"High alignment between student preference ('{best_student_pref}') and parent preference ('{best_parent_pref}')."
        elif conflict_score <= 40.0:
            level = "Low"
            explanation = f"Good domain overlap between student preference ('{best_student_pref}') and parent preference ('{best_parent_pref}')."
        elif conflict_score <= 60.0:
            level = "Moderate"
            explanation = f"Moderate divergence between student preference ('{best_student_pref}') and parent preference ('{best_parent_pref}')."
        elif conflict_score <= 80.0:
            level = "High"
            explanation = f"Significant divergence between student preference ('{best_student_pref}') and parent preference ('{best_parent_pref}')."
        else:
            level = "Very High"
            explanation = f"Sharp divergence between student preference ('{best_student_pref}') and parent preference ('{best_parent_pref}')."

        return {
            "conflict_score": conflict_score,
            "conflict_level": level,
            "explanation": explanation,
        }

    # -------------------------------------------------------------------------
    # 2. Interest vs. Aptitude Gap Detection
    # -------------------------------------------------------------------------
    def detect_interest_aptitude_conflicts(
        self,
        student_interests: Dict[str, Any],
        student_aptitude: Dict[str, Any],
        student_academic: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """Identify domains where student has high interest but notably lower aptitude."""
        warnings: List[Dict[str, Any]] = []
        combined_aptitude = {**student_academic, **student_aptitude}

        # Area mapping between interest terms and prerequisite aptitude/academic skills
        domain_prerequisites = {
            "ai": ["logical_reasoning", "numerical", "maths"],
            "mathematics": ["numerical", "maths", "logical_reasoning"],
            "software": ["logical_reasoning", "computer_science"],
            "mechanical": ["numerical", "physics", "spatial_ability"],
            "design": ["creative_thinking", "visual_spatial_ability", "creativity"],
        }

        for interest_name, raw_score in student_interests.items():
            interest_score = clamp_score(raw_score)
            if interest_score >= 75.0:
                # Find matching prerequisite areas
                for domain, prereqs in domain_prerequisites.items():
                    sim = compute_token_similarity(interest_name, domain)
                    if sim >= 0.6:
                        # Check student's proficiency in these prerequisites
                        scores = []
                        for req in prereqs:
                            val, _ = find_best_score_in_dict(req, combined_aptitude, default=0.0)
                            scores.append((req, val))

                        if scores:
                            avg_aptitude = sum(s[1] for s in scores) / len(scores)
                            gap = interest_score - avg_aptitude
                            if gap >= 20.0:
                                severity = "High" if gap >= 30.0 else "Medium"
                                warnings.append({
                                    "type": "interest_aptitude_gap",
                                    "severity": severity,
                                    "domain": interest_name,
                                    "interest_score": interest_score,
                                    "aptitude_score": round(avg_aptitude, 2),
                                    "gap": round(gap, 2),
                                    "message": (
                                        f"High enthusiasm in '{interest_name}' (score: {interest_score}) "
                                        f"exceeds foundational aptitude/academic score ({round(avg_aptitude, 2)}). "
                                        "Foundational preparation required."
                                    ),
                                })

        return warnings

    # -------------------------------------------------------------------------
    # 3. Financial Feasibility Warning
    # -------------------------------------------------------------------------
    def detect_financial_conflict(
        self,
        parent_profile: Dict[str, Any],
        career: Dict[str, Any],
    ) -> Dict[str, Any] | None:
        """Check for budget shortages relative to the career's estimated education cost."""
        budget = float(parent_profile.get("education_budget", 200000.0))

        financial_cost_data = career.get("financial_cost", {})
        if isinstance(financial_cost_data, (int, float)):
            cost = float(financial_cost_data)
        elif isinstance(financial_cost_data, dict):
            cost = float(
                financial_cost_data.get("estimated_annual_cost")
                or financial_cost_data.get("annual_cost")
                or 200000.0
            )
        else:
            cost = 200000.0

        if budget < cost:
            gap = round(cost - budget, 2)
            ratio = budget / cost if cost > 0 else 1.0
            severity = "High" if ratio < 0.5 else "Medium"
            return {
                "type": "financial_gap",
                "severity": severity,
                "education_budget": budget,
                "estimated_cost": cost,
                "cost_gap": gap,
                "message": (
                    f"Education budget (INR {budget:,.0f}) is lower than estimated annual preparation cost "
                    f"(INR {cost:,.0f}) for {career.get('career_name', 'this career')} (Gap: INR {gap:,.0f})."
                ),
            }
        return None

    # -------------------------------------------------------------------------
    # 4. Geographic Constraint Warning
    # -------------------------------------------------------------------------
    def detect_geographic_conflict(
        self,
        student_profile: Dict[str, Any],
        parent_profile: Dict[str, Any],
        career: Dict[str, Any],
    ) -> Dict[str, Any] | None:
        """Check for location restrictions when relocation is disallowed."""
        relocation_allowed = parent_profile.get("relocation_allowed", True)
        if relocation_allowed:
            return None

        loc_demand = career.get("location_demand", {})
        is_remote = loc_demand.get("remote_friendly", False) if isinstance(loc_demand, dict) else False
        if is_remote:
            return None

        primary_hubs = loc_demand.get("primary_hubs", []) if isinstance(loc_demand, dict) else []
        student_loc = student_profile.get("location", "")
        preferred_loc = parent_profile.get("preferred_location", "")

        matches_hub = any(
            compute_token_similarity(student_loc, hub) >= 0.7
            or compute_token_similarity(preferred_loc, hub) >= 0.7
            for hub in primary_hubs
        )

        if not matches_hub:
            return {
                "type": "geographic_constraint",
                "severity": "Medium",
                "student_location": student_loc,
                "preferred_location": preferred_loc,
                "career_hubs": primary_hubs,
                "message": (
                    f"Career hubs ({', '.join(primary_hubs)}) require relocation, but family "
                    f"prefers {preferred_loc or student_loc} without relocation."
                ),
            }
        return None

    # -------------------------------------------------------------------------
    # 5. Comprehensive Career Conflict Report
    # -------------------------------------------------------------------------
    def detect_all_conflicts(
        self,
        student_profile: Dict[str, Any],
        parent_profile: Dict[str, Any],
        career: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Aggregate all conflict checks into a structured career warning report."""
        warnings: List[Dict[str, Any]] = []

        # Parent-Student preference conflict
        pref_conflict = self.calculate_preference_conflict(
            student_profile.get("career_preferences", []),
            parent_profile.get("parent_career_preferences", []),
        )

        # Interest vs. Aptitude
        apt_warnings = self.detect_interest_aptitude_conflicts(
            student_profile.get("interests", {}),
            student_profile.get("aptitude", {}),
            student_profile.get("academic_scores", {}),
        )
        warnings.extend(apt_warnings)

        # Financial
        fin_warning = self.detect_financial_conflict(parent_profile, career)
        if fin_warning:
            warnings.append(fin_warning)

        # Geographic
        geo_warning = self.detect_geographic_conflict(student_profile, parent_profile, career)
        if geo_warning:
            warnings.append(geo_warning)

        # Determine overall conflict severity
        severities = [w.get("severity", "Low") for w in warnings]
        if "High" in severities or pref_conflict["conflict_score"] >= 61.0:
            overall_level = "High"
        elif "Medium" in severities or pref_conflict["conflict_score"] >= 41.0:
            overall_level = "Moderate"
        elif pref_conflict["conflict_score"] >= 21.0:
            overall_level = "Low"
        else:
            overall_level = "Very Low"

        return {
            "preference_conflict": pref_conflict,
            "overall_conflict_level": overall_level,
            "warnings": warnings,
        }
