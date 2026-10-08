"""PRISM AI - Core Scoring Engine.

Purpose:
--------
This module implements the deterministic, explainable multi-dimensional scoring engine:
1. Student Fit (35% Skills, 30% Aptitude, 25% Interests, 10% Personality)
2. Financial Fit (Affordability ratio, cost gap, status)
3. Market Fit (40% Market Demand, 30% Location Demand, 30% Future Growth)
4. Preference Match (Alignment with student's explicit career choices)
5. Overall Composite Score (40% Student Fit, 20% Financial Fit, 30% Market Fit, 10% Preference Match)
"""

from typing import Any, Dict, List, Tuple

from .normalization import (
    clamp_score,
    compute_token_similarity,
    find_best_score_in_dict,
    normalize_parent_profile,
    normalize_student_profile,
)


class ScoringEngine:
    """Computes transparent, multi-dimensional alignment scores for PRISM."""

    def __init__(self, weights: Dict[str, float] | None = None) -> None:
        """Initialize the scoring engine with configurable component weights."""
        self.weights = weights or {
            "student_fit": 0.40,
            "financial_fit": 0.20,
            "market_fit": 0.30,
            "preference_match": 0.10,
        }

        self.student_fit_weights = {
            "skills": 0.35,
            "aptitude": 0.30,
            "interests": 0.25,
            "personality": 0.10,
        }

        self.market_fit_weights = {
            "market_demand": 0.40,
            "location_demand": 0.30,
            "future_growth": 0.30,
        }

    # -------------------------------------------------------------------------
    # 1. Skill Match & Gap Analysis
    # -------------------------------------------------------------------------
    def calculate_skill_match(
        self,
        student_skills: Dict[str, Any],
        career: Dict[str, Any],
    ) -> Tuple[float, List[Dict[str, Any]]]:
        """Compare student skills against career required skills.

        Returns:
            Tuple of (skill_match_score: float, skill_gaps: list[dict])
        """
        required_skills = career.get("required_skills", [])
        if not required_skills:
            return 100.0, []

        benchmarks = career.get("skill_benchmarks", {})
        total_achievement = 0.0
        gaps: List[Dict[str, Any]] = []

        for req_skill in required_skills:
            req_name = str(req_skill)
            # Default required benchmark score is 75 if not specified
            req_score = clamp_score(benchmarks.get(req_name, 75.0), default=75.0)

            # Find best matching student skill score
            student_score, _ = find_best_score_in_dict(req_name, student_skills, default=0.0)

            # Calculate achievement ratio relative to required benchmark
            if req_score > 0:
                achievement = min(100.0, (student_score / req_score) * 100.0)
            else:
                achievement = 100.0
            total_achievement += achievement

            # Calculate skill gap
            gap = max(0.0, round(req_score - student_score, 2))
            if gap >= 25.0:
                priority = "High"
            elif gap >= 10.0:
                priority = "Medium"
            else:
                priority = "Low"

            gaps.append({
                "skill_name": req_name,
                "student_score": round(student_score, 2),
                "required_score": round(req_score, 2),
                "gap": gap,
                "priority": priority,
            })

        # Sort skill gaps descending by gap magnitude
        gaps.sort(key=lambda item: item["gap"], reverse=True)
        avg_skill_score = total_achievement / len(required_skills)
        return round(avg_skill_score, 2), gaps

    # -------------------------------------------------------------------------
    # 2. Aptitude Match
    # -------------------------------------------------------------------------
    def calculate_aptitude_match(
        self,
        student_aptitude: Dict[str, Any],
        student_academic: Dict[str, Any],
        career: Dict[str, Any],
    ) -> float:
        """Compare student aptitude and academic scores against career benchmarks."""
        aptitude_reqs = career.get("aptitude_requirements", {})
        if not aptitude_reqs:
            return 75.0

        total_match = 0.0
        # Combine student aptitude and academic scores for matching
        combined_student_profile = {**student_academic, **student_aptitude}

        for req_name, req_val in aptitude_reqs.items():
            req_benchmark = clamp_score(req_val, default=75.0)
            student_score, _ = find_best_score_in_dict(
                req_name, combined_student_profile, default=0.0
            )

            if req_benchmark > 0:
                match_val = min(100.0, (student_score / req_benchmark) * 100.0)
            else:
                match_val = 100.0
            total_match += match_val

        avg_aptitude_match = total_match / len(aptitude_reqs)
        return round(avg_aptitude_match, 2)

    # -------------------------------------------------------------------------
    # 3. Interest Match
    # -------------------------------------------------------------------------
    def calculate_interest_match(
        self,
        student_interests: Dict[str, Any],
        career: Dict[str, Any],
    ) -> float:
        """Compare student interests with career interest areas."""
        interest_areas = career.get("interest_areas", [])
        if not interest_areas:
            return 50.0

        if not student_interests:
            return 0.0

        total_interest_score = 0.0
        for area in interest_areas:
            score, _ = find_best_score_in_dict(area, student_interests, default=0.0)
            total_interest_score += score

        avg_interest_score = total_interest_score / len(interest_areas)
        return round(avg_interest_score, 2)

    # -------------------------------------------------------------------------
    # 4. Personality Match
    # -------------------------------------------------------------------------
    def calculate_personality_match(
        self,
        student_personality: Dict[str, Any],
        career: Dict[str, Any],
    ) -> float:
        """Evaluate personality / working-style alignment with career demands."""
        career_traits = career.get("personality_traits", {})
        if not career_traits:
            # If no explicit personality traits defined, check default alignment with analytical/creative
            if not student_personality:
                return 60.0
            avg_student_traits = sum(
                clamp_score(v) for v in student_personality.values()
            ) / max(1, len(student_personality))
            return round(avg_student_traits, 2)

        if not student_personality:
            return 50.0

        total_match = 0.0
        for trait_name, req_val in career_traits.items():
            benchmark = clamp_score(req_val, default=70.0)
            student_val, _ = find_best_score_in_dict(trait_name, student_personality, default=50.0)
            achievement = min(100.0, (student_val / benchmark) * 100.0) if benchmark > 0 else 100.0
            total_match += achievement

        avg_match = total_match / len(career_traits)
        return round(avg_match, 2)

    # -------------------------------------------------------------------------
    # 5. Student Fit Composite
    # -------------------------------------------------------------------------
    def calculate_student_fit(
        self,
        student_profile: Dict[str, Any],
        career: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Calculate holistic Student Fit score from Skill, Aptitude, Interest, and Personality.

        Weighting:
            Skill Match       = 35%
            Aptitude Match    = 30%
            Interest Match    = 25%
            Personality Match = 10%
        """
        student_skills = student_profile.get("skills", {})
        student_aptitude = student_profile.get("aptitude", {})
        student_academic = student_profile.get("academic_scores", {})
        student_interests = student_profile.get("interests", {})
        student_personality = student_profile.get("personality", {})

        skill_match, skill_gaps = self.calculate_skill_match(student_skills, career)
        aptitude_match = self.calculate_aptitude_match(student_aptitude, student_academic, career)
        interest_match = self.calculate_interest_match(student_interests, career)
        personality_match = self.calculate_personality_match(student_personality, career)

        student_fit = (
            self.student_fit_weights["skills"] * skill_match
            + self.student_fit_weights["aptitude"] * aptitude_match
            + self.student_fit_weights["interests"] * interest_match
            + self.student_fit_weights["personality"] * personality_match
        )

        return {
            "skill_match": round(skill_match, 2),
            "aptitude_match": round(aptitude_match, 2),
            "interest_match": round(interest_match, 2),
            "personality_match": round(personality_match, 2),
            "student_fit": round(student_fit, 2),
            "skill_gaps": skill_gaps,
        }

    # -------------------------------------------------------------------------
    # 6. Financial Fit Score
    # -------------------------------------------------------------------------
    def calculate_financial_fit(
        self,
        parent_profile: Dict[str, Any],
        career: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Compute Financial Fit Score based on education budget and career financial cost.

        Ratio mapping:
            ratio >= 1.0     -> 100
            0.75 - 0.99     -> 85
            0.50 - 0.74     -> 70
            0.25 - 0.49     -> 50
            < 0.25          -> 25

        Affordability status:
            ratio >= 1.0    -> "Affordable"
            0.50 <= r < 1.0 -> "Partially Affordable"
            ratio < 0.50    -> "Difficult"
        """
        education_budget = float(parent_profile.get("education_budget", 200000.0))

        financial_cost_data = career.get("financial_cost", {})
        if isinstance(financial_cost_data, (int, float)):
            estimated_cost = float(financial_cost_data)
        elif isinstance(financial_cost_data, dict):
            estimated_cost = float(
                financial_cost_data.get("estimated_annual_cost")
                or financial_cost_data.get("annual_cost")
                or 200000.0
            )
        else:
            estimated_cost = 200000.0

        if estimated_cost <= 0:
            financial_ratio = 1.0
        else:
            financial_ratio = round(education_budget / estimated_cost, 2)

        # Map ratio to 0-100 score
        if financial_ratio >= 1.0:
            score = 100.0
            status = "Affordable"
        elif financial_ratio >= 0.75:
            score = 85.0
            status = "Partially Affordable"
        elif financial_ratio >= 0.50:
            score = 70.0
            status = "Partially Affordable"
        elif financial_ratio >= 0.25:
            score = 50.0
            status = "Difficult"
        else:
            score = 25.0
            status = "Difficult"

        financial_gap = max(0.0, round(estimated_cost - education_budget, 2))

        return {
            "financial_fit": score,
            "financial_ratio": financial_ratio,
            "estimated_cost": estimated_cost,
            "education_budget": education_budget,
            "financial_gap": financial_gap,
            "affordability_status": status,
        }

    # -------------------------------------------------------------------------
    # 7. Market Fit Score
    # -------------------------------------------------------------------------
    def calculate_market_fit(
        self,
        career: Dict[str, Any],
        student_location: str = "",
        preferred_location: str = "",
        relocation_allowed: bool = True,
    ) -> Dict[str, Any]:
        """Compute Market Fit Score from market demand, location demand, and future growth.

        Formula:
            Market Fit = 40% market_demand + 30% location_demand + 30% future_growth
        """
        # Parse market_demand (dict or direct number)
        m_demand = career.get("market_demand", 75.0)
        if isinstance(m_demand, dict):
            market_score = clamp_score(m_demand.get("score"), default=80.0)
        else:
            market_score = clamp_score(m_demand, default=80.0)

        # Parse location_demand (dict or direct number)
        l_demand = career.get("location_demand", 75.0)
        if isinstance(l_demand, dict):
            base_location_score = clamp_score(l_demand.get("score"), default=80.0)
            is_remote = bool(l_demand.get("remote_friendly", False))
            primary_hubs = l_demand.get("primary_hubs", [])

            # Modulate based on student/parent location if provided
            if student_location or preferred_location:
                has_local_match = any(
                    compute_token_similarity(student_location, str(hub)) >= 0.6
                    or compute_token_similarity(preferred_location, str(hub)) >= 0.6
                    for hub in primary_hubs
                )

                if is_remote:
                    # Remote-friendly roles are highly accessible regardless of geography
                    location_score = base_location_score
                elif has_local_match:
                    # Career has active hiring hubs in the student's immediate region
                    location_score = min(100.0, round(base_location_score * 1.05, 2))
                elif not relocation_allowed:
                    # On-site role requiring relocation when relocation is strictly disallowed
                    location_score = round(base_location_score * 0.60, 2)
                else:
                    # On-site role requiring relocation, but student is open to relocation
                    location_score = round(base_location_score * 0.90, 2)
            else:
                location_score = base_location_score
        else:
            location_score = clamp_score(l_demand, default=80.0)

        # Parse future_growth (dict or direct number)
        f_growth = career.get("future_growth", 75.0)
        if isinstance(f_growth, dict):
            growth_score = clamp_score(f_growth.get("score"), default=80.0)
        else:
            growth_score = clamp_score(f_growth, default=80.0)

        market_fit = (
            self.market_fit_weights["market_demand"] * market_score
            + self.market_fit_weights["location_demand"] * location_score
            + self.market_fit_weights["future_growth"] * growth_score
        )

        return {
            "market_demand": round(market_score, 2),
            "location_demand": round(location_score, 2),
            "future_growth": round(growth_score, 2),
            "market_fit": round(market_fit, 2),
        }

    # -------------------------------------------------------------------------
    # 8. Preference Match
    # -------------------------------------------------------------------------
    def calculate_preference_match(
        self,
        student_preferences: List[str],
        career_name: str,
    ) -> float:
        """Measure how closely the career matches student explicit career preferences."""
        if not student_preferences:
            return 50.0  # Neutral baseline when student has expressed no specific preference

        best_similarity = 0.0
        for pref in student_preferences:
            sim = compute_token_similarity(pref, career_name)
            if sim > best_similarity:
                best_similarity = sim

        # Exact match
        if best_similarity >= 0.95:
            return 100.0
        # High keyword overlap / synonym
        elif best_similarity >= 0.70:
            return 80.0
        # Moderate domain overlap
        elif best_similarity >= 0.40:
            return 50.0
        else:
            return 0.0

    # -------------------------------------------------------------------------
    # 9. Overall Career Score
    # -------------------------------------------------------------------------
    def calculate_overall_career_score(
        self,
        student_fit: float,
        financial_fit: float,
        market_fit: float,
        preference_match: float,
    ) -> float:
        """Synthesize dimensions into a weighted overall score between 0.0 and 100.0.

        Weighting:
            Student Fit       = 40%
            Financial Fit     = 20%
            Market Fit        = 30%
            Preference Match  = 10%
        """
        overall = (
            self.weights["student_fit"] * student_fit
            + self.weights["financial_fit"] * financial_fit
            + self.weights["market_fit"] * market_fit
            + self.weights["preference_match"] * preference_match
        )

        clamped = max(0.0, min(100.0, overall))
        return round(clamped, 2)
