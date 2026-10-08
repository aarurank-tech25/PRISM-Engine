"""PRISM Career Analysis - Runnable Demo.

This script executes the complete PRISM AI scoring engine using a representative
student profile and parent/family financial profile, printing detailed explainable
recommendations, conflict ratings, and action plans.
"""

from ai_engine import run_prism_analysis


def main():
    # 1. Define Fictional Student Profile (0-100 scores)
    student_profile = {
        "name": "Demo Student",
        "age": 18,
        "education_level": "12th Grade",
        "location": "Coimbatore",
        "academic_scores": {
            "maths": 85,
            "physics": 78,
            "computer_science": 90,
        },
        "skills": {
            "python": 90,
            "problem_solving": 85,
            "communication": 65,
            "creativity": 70,
        },
        "interests": {
            "ai": 95,
            "software": 90,
            "design": 70,
            "mechanical": 40,
        },
        "aptitude": {
            "logical_reasoning": 88,
            "numerical": 84,
            "verbal": 68,
        },
        "personality": {
            "analytical": 90,
            "creative": 72,
            "leadership": 65,
        },
        "career_preferences": [
            "AI Engineer",
            "Data Scientist",
        ],
    }

    # 2. Define Parent / Family Financial & Preference Profile
    parent_profile = {
        "annual_income": 600000,
        "education_budget": 200000,
        "risk_appetite": "medium",
        "preferred_location": "Tamil Nadu",
        "parent_career_preferences": [
            "Engineering",
        ],
        "relocation_allowed": True,
    }

    # 3. Run PRISM Analysis Pipeline
    results = run_prism_analysis(student_profile, parent_profile, top_k=5)

    summary = results["summary"]
    conflict_analysis = results["conflict_analysis"]
    ranked_careers = results["ranked_careers"]

    # 4. Print PRISM Analysis Report
    print("=" * 65)
    print("PRISM CAREER ANALYSIS")
    print("=" * 65)
    print(f"Student Name: {summary['student_name']}")
    print(f"Evaluated Career Pathways: {summary['evaluated_careers_count']}")
    print("-" * 65)

    for idx, career in enumerate(ranked_careers, 1):
        print(f"\nTop Career {idx}: {career['career_name']}")
        print(f"  Score:            {career['final_score']} / 100")
        print(f"  Student Fit:      {career['student_fit']} / 100")
        print(f"  Financial Fit:    {career['financial_fit']} / 100 ({career['affordability_status']})")
        print(f"  Market Fit:       {career['market_fit']} / 100")
        print(f"  Conflict:         {career['conflict_level']}")
        print(f"  Why Recommended:  {career['why_recommended']}")

        # Format Skill Gaps
        skill_gaps = career.get("skill_gaps", [])
        if skill_gaps:
            gaps_str = ", ".join(
                f"{g['skill_name']} [gap: {g['gap']}, {g['priority']} priority]"
                for g in skill_gaps
            )
            print(f"  Skill Gaps:       {gaps_str}")
        else:
            print("  Skill Gaps:       None identified")

        # Format Alternative Careers
        alts = career.get("alternative_careers", [])
        if alts:
            alts_str = ", ".join(
                f"{a['career_name']} (Cost: INR {a['estimated_cost']:,.0f}, Fit: {a['student_fit']})"
                for a in alts
            )
            print(f"  Alternatives:     {alts_str}")
        else:
            print("  Alternatives:     Not required (High feasibility & low friction)")

    # 5. Print Global Conflict and Summary Diagnostics
    print("\n" + "=" * 65)
    print("SUMMARY DIAGNOSTICS & ALERTS")
    print("=" * 65)
    pref_conflict = conflict_analysis["preference_conflict"]
    print(f"Overall Parent-Student Conflict: {pref_conflict['conflict_level']} (Index: {pref_conflict['conflict_score']}/100)")
    print(f"  Details: {pref_conflict['explanation']}")
    print(f"Financial Feasibility:           {summary['financial_feasibility_summary']} for top match")

    print("\nImportant Warnings:")
    # Collect warnings from conflict analysis and top careers
    warnings_found = False
    for gap_warn in conflict_analysis.get("interest_aptitude_gaps", []):
        warnings_found = True
        print(f"  - [{gap_warn['severity']} Aptitude Gap] {gap_warn['message']}")

    for career in ranked_careers[:3]:
        for warn in career.get("warnings", []):
            if warn.get("type") != "interest_aptitude_gap":
                warnings_found = True
                print(f"  - [{warn.get('severity', 'Notice')} Warning for {career['career_name']}] {warn['message']}")

    if not warnings_found:
        print("  - None: No critical academic, financial, or geographic conflicts detected.")

    print("=" * 65)


if __name__ == "__main__":
    main()
