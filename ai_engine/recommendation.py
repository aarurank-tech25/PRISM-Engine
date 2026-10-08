"""PRISM AI - Recommendation & Action Planning Engine.

Purpose:
--------
Synthesizes multi-dimensional scoring results, conflict analyses, and skill gaps
into explainable, evidence-backed career recommendations, actionable next steps,
and realistic alternative pathways.
"""

from typing import Any, Dict, List

from .normalization import compute_token_similarity


class RecommendationEngine:
    """Produces explainable career guidance, personalized roadmaps, and alternatives."""

    def __init__(self) -> None:
        """Initialize the recommendation engine."""
        pass

    def extract_strengths(
        self,
        student_profile: Dict[str, Any],
        career: Dict[str, Any],
        student_fit_data: Dict[str, Any],
    ) -> List[str]:
        """Extract top concrete strengths where student excels relative to career demands."""
        strengths: List[str] = []
        skills = student_profile.get("skills", {})
        aptitude = student_profile.get("aptitude", {})
        academic = student_profile.get("academic_scores", {})
        interests = student_profile.get("interests", {})

        # Top skills
        for skill_name, raw_score in skills.items():
            if raw_score >= 80.0:
                # Check if relevant to career
                for req in career.get("required_skills", []):
                    if compute_token_similarity(skill_name, str(req)) >= 0.6:
                        strengths.append(f"Strong proficiency in {req} ({raw_score}/100)")
                        break

        # Top aptitude / academic
        combined_apt = {**academic, **aptitude}
        for apt_name, raw_score in combined_apt.items():
            if raw_score >= 80.0:
                for req in career.get("aptitude_requirements", {}).keys():
                    if compute_token_similarity(apt_name, str(req)) >= 0.6:
                        formatted_name = req.replace("_", " ").title()
                        strengths.append(f"High {formatted_name} aptitude ({raw_score}/100)")
                        break

        # Top interests
        for int_name, raw_score in interests.items():
            if raw_score >= 85.0:
                for area in career.get("interest_areas", []):
                    if compute_token_similarity(int_name, str(area)) >= 0.6:
                        strengths.append(f"Deep interest in {area} ({raw_score}/100)")
                        break

        # Fallback if no specific high scores matched
        if not strengths:
            if student_fit_data.get("skill_match", 0) >= 70:
                strengths.append(f"Good foundational skill match ({student_fit_data['skill_match']}/100)")
            if student_fit_data.get("aptitude_match", 0) >= 70:
                strengths.append(f"Solid aptitude compatibility ({student_fit_data['aptitude_match']}/100)")

        # Return unique top strengths
        return list(dict.fromkeys(strengths))[:4]

    def build_why_recommended(
        self,
        career_name: str,
        student_fit_data: Dict[str, Any],
        financial_fit_data: Dict[str, Any],
        market_fit_data: Dict[str, Any],
        strengths: List[str],
    ) -> str:
        """Construct an explainable justification strictly derived from computed scores."""
        reasons = []

        if student_fit_data.get("student_fit", 0) >= 75.0:
            reasons.append(f"high student fit ({student_fit_data['student_fit']}/100)")
        elif student_fit_data.get("student_fit", 0) >= 60.0:
            reasons.append(f"moderate student fit ({student_fit_data['student_fit']}/100)")

        if strengths:
            reasons.append(f"strengths in {', '.join(strengths[:2])}")

        affordability = financial_fit_data.get("affordability_status", "Affordable")
        reasons.append(f"{affordability.lower()} financial feasibility")

        market_score = market_fit_data.get("market_fit", 0)
        if market_score >= 80.0:
            reasons.append(f"strong market demand ({market_score}/100)")
        else:
            reasons.append(f"stable market outlook ({market_score}/100)")

        reason_str = ", ".join(reasons)
        return f"Recommended for {career_name} because of {reason_str}."

    def build_next_steps(
        self,
        skill_gaps: List[Dict[str, Any]],
        affordability_status: str,
        financial_gap: float,
    ) -> List[str]:
        """Generate concrete next steps based on identified gaps and financial status."""
        steps: List[str] = []

        # Address High and Medium priority skill gaps
        for gap_item in skill_gaps:
            if gap_item.get("priority") in ("High", "Medium"):
                skill = gap_item["skill_name"]
                gap_val = gap_item["gap"]
                steps.append(
                    f"Bridge skill gap in {skill} (current: {gap_item['student_score']}, "
                    f"target: {gap_item['required_score']}, gap: {gap_val}) via structured courses/projects."
                )

        # Address financial readiness
        if affordability_status != "Affordable" and financial_gap > 0:
            steps.append(
                f"Explore scholarships, educational loans, or work-study programs to cover the "
                f"estimated annual cost gap of INR {financial_gap:,.0f}."
            )

        if not steps:
            steps.append("Build a portfolio of capstone projects to showcase existing competencies.")
            steps.append("Participate in relevant industry hackathons and internships.")

        return steps[:4]

    def find_alternative_careers(
        self,
        target_career: Dict[str, Any],
        all_evaluated_careers: List[Dict[str, Any]],
        min_alternatives: int = 2,
    ) -> List[Dict[str, Any]]:
        """Identify viable alternative careers if the target career exhibits friction.

        Triggers:
        - Low financial feasibility ('Partially Affordable' or 'Difficult')
        - High priority skill gaps
        - High/Moderate conflict

        Preferences:
        - Shared interest areas
        - Lower or equal financial cost
        - High student fit
        - Solid market demand
        """
        needs_alternatives = False

        fin_status = target_career.get("affordability_status")
        if fin_status in ("Partially Affordable", "Difficult"):
            needs_alternatives = True

        high_skill_gaps = [
            g for g in target_career.get("skill_gaps", []) if g.get("priority") == "High"
        ]
        if high_skill_gaps:
            needs_alternatives = True

        conflict_level = target_career.get("conflict_level", "Low")
        if conflict_level in ("Moderate", "High", "Very High"):
            needs_alternatives = True

        if not needs_alternatives:
            return []

        target_name = target_career.get("career_name", "")
        target_interests = target_career.get("interest_areas", [])
        target_cost = target_career.get("estimated_cost", 300000.0)

        scored_candidates = []
        for candidate in all_evaluated_careers:
            cand_name = candidate.get("career_name", "")
            if cand_name == target_name:
                continue

            # Check interest overlap
            cand_interests = candidate.get("interest_areas", [])
            overlap = 0
            for t_int in target_interests:
                if any(compute_token_similarity(t_int, c_int) >= 0.6 for c_int in cand_interests):
                    overlap += 1

            # Candidate cost advantage
            cand_cost = candidate.get("estimated_cost", 200000.0)
            cost_advantage = max(0.0, target_cost - cand_cost)

            # Heuristic score for alternative suitability
            cand_score = (
                candidate.get("student_fit", 0) * 0.45
                + candidate.get("financial_fit", 0) * 0.35
                + candidate.get("market_fit", 0) * 0.20
                + (overlap * 5.0)
            )

            scored_candidates.append({
                "career_name": cand_name,
                "final_score": candidate.get("final_score", 0),
                "student_fit": candidate.get("student_fit", 0),
                "affordability_status": candidate.get("affordability_status", "Affordable"),
                "estimated_cost": cand_cost,
                "reason_as_alternative": (
                    f"Higher affordability (cost: INR {cand_cost:,.0f} vs INR {target_cost:,.0f}) "
                    f"with strong student fit ({candidate.get('student_fit', 0)}/100)."
                    if cand_cost < target_cost
                    else f"Aligned student fit ({candidate.get('student_fit', 0)}/100) and market outlook."
                ),
                "_sorting_score": cand_score,
            })

        scored_candidates.sort(key=lambda item: item["_sorting_score"], reverse=True)

        # Remove internal sorting key
        alternatives = []
        for item in scored_candidates[:min_alternatives]:
            clean_item = dict(item)
            clean_item.pop("_sorting_score", None)
            alternatives.append(clean_item)

        return alternatives

    def format_career_recommendation(
        self,
        evaluated_career: Dict[str, Any],
        student_profile: Dict[str, Any],
        all_evaluated_careers: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Assemble full recommendation payload for an individual evaluated career."""
        strengths = self.extract_strengths(
            student_profile, evaluated_career, evaluated_career
        )

        why_rec = self.build_why_recommended(
            evaluated_career.get("career_name", ""),
            evaluated_career,
            evaluated_career,
            evaluated_career,
            strengths,
        )

        next_steps = self.build_next_steps(
            evaluated_career.get("skill_gaps", []),
            evaluated_career.get("affordability_status", "Affordable"),
            evaluated_career.get("financial_gap", 0.0),
        )

        alternatives = self.find_alternative_careers(
            evaluated_career, all_evaluated_careers, min_alternatives=2
        )

        return {
            "career_name": evaluated_career.get("career_name"),
            "final_score": evaluated_career.get("final_score"),
            "student_fit": evaluated_career.get("student_fit"),
            "financial_fit": evaluated_career.get("financial_fit"),
            "market_fit": evaluated_career.get("market_fit"),
            "preference_match": evaluated_career.get("preference_match"),
            "affordability_status": evaluated_career.get("affordability_status"),
            "conflict_level": evaluated_career.get("conflict_level"),
            "skill_gaps": evaluated_career.get("skill_gaps", []),
            "strengths": strengths,
            "warnings": evaluated_career.get("warnings", []),
            "why_recommended": why_rec,
            "next_steps": next_steps,
            "alternative_careers": alternatives,
        }
