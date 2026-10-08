"""Unit and Integration tests for PRISM AI Core Scoring Engine.

Verifies:
1. Core module and class imports.
2. Careers dataset existence and schema compliance.
3. Score normalization and input sanitization.
4. Student fit multi-dimensional calculation.
5. Financial fit, ratio, and affordability status mapping.
6. Market fit calculation.
7. Explicit preference matching.
8. Parent-student conflict index and warning generation.
9. Skill gap analysis, priority thresholds, and sorting.
10. Career ranking.
11. Incomplete and corrupt student data resilience.
12. End-to-end PRISM pipeline execution (`run_prism_analysis`).
"""

import json
from pathlib import Path
import unittest

from ai_engine import (
    CareerMatcher,
    ConflictDetector,
    RecommendationEngine,
    ScoringEngine,
    clamp_score,
    normalize_parent_profile,
    normalize_student_profile,
    run_prism_analysis,
)


class TestModuleImports(unittest.TestCase):
    """Test that all ai_engine modules and classes can be cleanly imported."""

    def test_import_scoring_module(self):
        """Verify scoring module and ScoringEngine class import."""
        from ai_engine.scoring import ScoringEngine

        engine = ScoringEngine()
        self.assertIsInstance(engine, ScoringEngine)
        self.assertIn("student_fit", engine.weights)

    def test_import_career_matcher_module(self):
        """Verify career_matcher module and CareerMatcher class import."""
        from ai_engine.career_matcher import CareerMatcher

        matcher = CareerMatcher()
        self.assertIsInstance(matcher, CareerMatcher)

    def test_import_conflict_module(self):
        """Verify conflict module and ConflictDetector class import."""
        from ai_engine.conflict import ConflictDetector

        detector = ConflictDetector()
        self.assertIsInstance(detector, ConflictDetector)

    def test_import_recommendation_module(self):
        """Verify recommendation module and RecommendationEngine class import."""
        from ai_engine.recommendation import RecommendationEngine

        rec_engine = RecommendationEngine()
        self.assertIsInstance(rec_engine, RecommendationEngine)

    def test_package_level_imports(self):
        """Verify top-level package exposes all required classes and pipeline functions."""
        import ai_engine

        self.assertTrue(hasattr(ai_engine, "ScoringEngine"))
        self.assertTrue(hasattr(ai_engine, "CareerMatcher"))
        self.assertTrue(hasattr(ai_engine, "ConflictDetector"))
        self.assertTrue(hasattr(ai_engine, "RecommendationEngine"))
        self.assertTrue(hasattr(ai_engine, "run_prism_analysis"))


class TestCareersData(unittest.TestCase):
    """Test that the careers benchmark JSON file is present and structurally sound."""

    def setUp(self):
        self.project_root = Path(__file__).resolve().parent.parent
        self.careers_path = self.project_root / "data" / "careers.json"

    def test_careers_file_exists(self):
        """Ensure data/careers.json file is present."""
        self.assertTrue(
            self.careers_path.exists(),
            f"careers.json not found at {self.careers_path}",
        )

    def test_careers_json_structure(self):
        """Ensure careers.json parses and contains all required career schema keys."""
        with open(self.careers_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 5, "careers.json should contain at least 5 careers")

        required_keys = [
            "career_name",
            "required_skills",
            "aptitude_requirements",
            "interest_areas",
            "financial_cost",
            "market_demand",
            "location_demand",
            "future_growth",
        ]

        for career in data:
            for key in required_keys:
                self.assertIn(
                    key,
                    career,
                    f"Career entry '{career.get('career_name', 'Unknown')}' is missing required key '{key}'",
                )


class TestScoreNormalization(unittest.TestCase):
    """Test normalization and sanitization functions."""

    def test_clamp_score_valid_and_boundaries(self):
        """Test numeric clamping within [0.0, 100.0]."""
        self.assertEqual(clamp_score(50), 50.0)
        self.assertEqual(clamp_score(150), 100.0)
        self.assertEqual(clamp_score(-20), 0.0)
        self.assertEqual(clamp_score(0.85), 85.0)  # fraction scaling

    def test_clamp_score_corrupt_and_missing(self):
        """Test resilience against None, invalid strings, and bad types."""
        self.assertEqual(clamp_score(None, default=45.0), 45.0)
        self.assertEqual(clamp_score("not_a_number", default=20.0), 20.0)
        self.assertEqual(clamp_score("95.5"), 95.5)

    def test_normalize_profiles(self):
        """Ensure student and parent profile sanitization handles empty/malformed data."""
        s = normalize_student_profile(None)
        self.assertIsInstance(s["skills"], dict)
        self.assertIsInstance(s["career_preferences"], list)

        p = normalize_parent_profile({"education_budget": "180000"})
        self.assertEqual(p["education_budget"], 180000.0)
        self.assertTrue(p["relocation_allowed"])


class TestScoringCalculations(unittest.TestCase):
    """Test multi-dimensional scoring engine components."""

    def setUp(self):
        self.engine = ScoringEngine()
        self.mock_career = {
            "career_name": "Test Data Scientist",
            "required_skills": ["Python", "SQL"],
            "skill_benchmarks": {"Python": 80, "SQL": 70},
            "aptitude_requirements": {"logical_reasoning": 80, "numerical": 75},
            "interest_areas": ["Artificial Intelligence", "Analytics"],
            "personality_traits": {"analytical": 80},
            "financial_cost": {"estimated_annual_cost": 200000},
            "market_demand": {"score": 90.0},
            "location_demand": {"score": 80.0},
            "future_growth": {"score": 85.0},
        }

    def test_student_fit_calculation(self):
        """Test calculation of Student Fit from skills, aptitude, interests, and personality."""
        student_profile = {
            "skills": {"python": 80, "sql": 70},
            "aptitude": {"logical_reasoning": 80, "numerical": 75},
            "academic_scores": {},
            "interests": {"artificial intelligence": 90, "analytics": 80},
            "personality": {"analytical": 80},
        }
        res = self.engine.calculate_student_fit(student_profile, self.mock_career)
        self.assertIn("student_fit", res)
        self.assertIn("skill_match", res)
        self.assertIn("aptitude_match", res)
        self.assertIn("interest_match", res)
        self.assertIn("personality_match", res)
        self.assertGreaterEqual(res["student_fit"], 90.0)

    def test_financial_fit_calculation(self):
        """Test financial ratio mapping to score and status."""
        # Case 1: Affordable (budget >= cost)
        res1 = self.engine.calculate_financial_fit({"education_budget": 200000}, self.mock_career)
        self.assertEqual(res1["financial_fit"], 100.0)
        self.assertEqual(res1["affordability_status"], "Affordable")
        self.assertEqual(res1["financial_gap"], 0.0)

        # Case 2: Partially affordable (0.5 <= ratio < 0.75)
        res2 = self.engine.calculate_financial_fit({"education_budget": 120000}, self.mock_career)
        self.assertEqual(res2["financial_fit"], 70.0)
        self.assertEqual(res2["affordability_status"], "Partially Affordable")
        self.assertEqual(res2["financial_gap"], 80000.0)

        # Case 3: Difficult (ratio < 0.25)
        res3 = self.engine.calculate_financial_fit({"education_budget": 30000}, self.mock_career)
        self.assertEqual(res3["financial_fit"], 25.0)
        self.assertEqual(res3["affordability_status"], "Difficult")
        self.assertEqual(res3["financial_gap"], 170000.0)

    def test_market_fit_calculation(self):
        """Test market fit weighted aggregation (40% demand, 30% location, 30% growth)."""
        res = self.engine.calculate_market_fit(self.mock_career)
        expected = round(0.40 * 90.0 + 0.30 * 80.0 + 0.30 * 85.0, 2)
        self.assertEqual(res["market_fit"], expected)
        self.assertEqual(res["market_demand"], 90.0)

    def test_location_influence_on_market_fit(self):
        """Verify that student location and relocation constraints modulate location_demand."""
        onsite_career = {
            "career_name": "Mechanical Engineer",
            "market_demand": {"score": 80.0},
            "location_demand": {
                "score": 80.0,
                "remote_friendly": False,
                "primary_hubs": ["Chennai", "Coimbatore"],
            },
            "future_growth": {"score": 80.0},
        }

        # Case 1: Student in a primary hub (local match)
        local_fit = self.engine.calculate_market_fit(
            onsite_career, student_location="Coimbatore", relocation_allowed=True
        )

        # Case 2: Student far and relocation disallowed
        relocation_denied_fit = self.engine.calculate_market_fit(
            onsite_career, student_location="Delhi", relocation_allowed=False
        )

        self.assertGreater(local_fit["location_demand"], relocation_denied_fit["location_demand"])
        self.assertGreater(local_fit["market_fit"], relocation_denied_fit["market_fit"])


    def test_preference_match(self):
        """Test student explicit career preference matching."""
        # Exact / close match
        score1 = self.engine.calculate_preference_match(["Data Scientist"], "Data Scientist")
        self.assertEqual(score1, 100.0)

        # Partial / domain match
        score2 = self.engine.calculate_preference_match(["AI Engineer"], "Data Scientist")
        self.assertGreater(score2, 0.0)

        # No match
        score3 = self.engine.calculate_preference_match(["Music Composer"], "Data Scientist")
        self.assertEqual(score3, 0.0)


class TestConflictDetector(unittest.TestCase):
    """Test parent-student conflict analysis and constraint warnings."""

    def setUp(self):
        self.detector = ConflictDetector()

    def test_preference_conflict_levels(self):
        """Test conflict scores between matching vs opposing preferences."""
        # High alignment -> Very Low conflict
        c1 = self.detector.calculate_preference_conflict(["Engineering"], ["Engineering"])
        self.assertEqual(c1["conflict_level"], "Very Low")
        self.assertLessEqual(c1["conflict_score"], 20.0)

        # Opposing preferences -> High / Very High conflict
        c2 = self.detector.calculate_preference_conflict(
            ["UI/UX Designer"], ["Medical Doctor", "Civil Services"]
        )
        self.assertIn(c2["conflict_level"], ("High", "Very High"))
        self.assertGreater(c2["conflict_score"], 60.0)

    def test_interest_aptitude_gap_detection(self):
        """Test detection of high enthusiasm with low aptitude."""
        warnings = self.detector.detect_interest_aptitude_conflicts(
            student_interests={"ai": 95},
            student_aptitude={"logical_reasoning": 45, "numerical": 40},
            student_academic={"maths": 42},
        )
        self.assertGreaterEqual(len(warnings), 1)
        self.assertEqual(warnings[0]["type"], "interest_aptitude_gap")


class TestSkillGapAnalysis(unittest.TestCase):
    """Test skill gap computation, thresholds, and priority sorting."""

    def test_skill_gaps_and_priorities(self):
        engine = ScoringEngine()
        career = {
            "required_skills": ["Python", "Machine Learning", "SQL"],
            "skill_benchmarks": {"Python": 80, "Machine Learning": 75, "SQL": 70},
        }
        student_skills = {
            "python": 50,           # gap: 30 -> High
            "machine_learning": 60, # gap: 15 -> Medium
            "sql": 65,              # gap: 5  -> Low
        }
        _, gaps = engine.calculate_skill_match(student_skills, career)
        self.assertEqual(len(gaps), 3)

        # Verifies sorting descending by gap
        self.assertEqual(gaps[0]["skill_name"], "Python")
        self.assertEqual(gaps[0]["priority"], "High")
        self.assertEqual(gaps[1]["skill_name"], "Machine Learning")
        self.assertEqual(gaps[1]["priority"], "Medium")
        self.assertEqual(gaps[2]["skill_name"], "SQL")
        self.assertEqual(gaps[2]["priority"], "Low")


class TestCareerMatcherAndRanking(unittest.TestCase):
    """Test ranking careers and ensuring non-preferred careers are evaluated."""

    def test_career_ranking_top_5(self):
        matcher = CareerMatcher()
        student_profile = {
            "name": "Alex",
            "skills": {"python": 85, "machine_learning": 80, "problem_solving": 80},
            "aptitude": {"logical_reasoning": 85, "numerical": 80},
            "academic_scores": {"computer_science": 90, "maths": 85},
            "interests": {"artificial intelligence": 90, "software": 85},
            "personality": {"analytical": 85},
            "career_preferences": ["AI Engineer"],
        }
        parent_profile = {
            "annual_income": 600000,
            "education_budget": 250000,
            "parent_career_preferences": ["Engineering"],
        }
        ranked = matcher.match_and_rank(student_profile, parent_profile, top_k=5)
        self.assertEqual(len(ranked), 5)

        # Verify sorted descending
        for i in range(len(ranked) - 1):
            self.assertGreaterEqual(
                ranked[i]["final_score"], ranked[i + 1]["final_score"]
            )

    def test_profile_differentiation_ranking(self):
        """Verify the engine produces distinctly different top career rankings for contrasting profiles."""
        matcher = CareerMatcher()

        # Design-oriented student
        design_student = {
            "name": "Design Student",
            "skills": {"wireframing": 85, "user_research": 80, "creativity": 90},
            "aptitude": {"creative_thinking": 90, "verbal": 80, "logical_reasoning": 65},
            "academic_scores": {},
            "interests": {"design": 95, "visual arts": 90},
            "personality": {"creative": 92},
            "career_preferences": ["UI/UX Product Designer"],
        }
        design_parent = {"education_budget": 200000, "parent_career_preferences": ["Design"]}

        # Mechatronics/Robotics student
        robotics_student = {
            "name": "Robotics Student",
            "skills": {"robotics_control": 85, "sensors": 80, "problem_solving": 85},
            "aptitude": {"spatial_ability": 88, "logical_reasoning": 86, "numerical": 82},
            "academic_scores": {"physics": 88, "maths": 85},
            "interests": {"robotics": 95, "mechanical": 90, "automation": 85},
            "personality": {"analytical": 88},
            "career_preferences": ["Robotics & Automation Engineer"],
        }
        robotics_parent = {"education_budget": 300000, "parent_career_preferences": ["Engineering"]}

        design_top = matcher.match_and_rank(design_student, design_parent, top_k=1)[0]
        robotics_top = matcher.match_and_rank(robotics_student, robotics_parent, top_k=1)[0]

        self.assertEqual(design_top["career_name"], "UI/UX Product Designer")
        self.assertEqual(robotics_top["career_name"], "Robotics & Automation Engineer")
        self.assertNotEqual(design_top["career_name"], robotics_top["career_name"])



class TestIncompleteStudentData(unittest.TestCase):
    """Ensure engine never crashes when student data is empty or missing."""

    def test_empty_student_and_parent_data(self):
        res = run_prism_analysis(student_profile={}, parent_profile={})
        self.assertIn("summary", res)
        self.assertIn("conflict_analysis", res)
        self.assertIn("ranked_careers", res)
        self.assertGreaterEqual(len(res["ranked_careers"]), 1)


class TestEndToEndPipeline(unittest.TestCase):
    """Test complete end-to-end PRISM analysis pipeline with explainable outputs."""

    def test_run_prism_analysis_demo_case(self):
        student_profile = {
            "name": "Demo Student",
            "age": 18,
            "education_level": "12th",
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

        result = run_prism_analysis(student_profile, parent_profile, top_k=5)

        # Verify output top-level structure
        self.assertIn("summary", result)
        self.assertIn("conflict_analysis", result)
        self.assertIn("ranked_careers", result)

        ranked = result["ranked_careers"]
        self.assertEqual(len(ranked), 5)

        # Inspect top career recommendation
        top_career = ranked[0]
        self.assertTrue(top_career["career_name"])
        self.assertGreater(top_career["final_score"], 0.0)
        self.assertIn("why_recommended", top_career)
        self.assertIn("next_steps", top_career)
        self.assertIn("skill_gaps", top_career)
        self.assertIn("strengths", top_career)

        # Ensure explanation mentions actual computed reasoning
        self.assertIn("Recommended", top_career["why_recommended"])


class TestBackendIntegration(unittest.TestCase):
    """Test backend integration contract, JSON serialization, and sample request execution."""

    def setUp(self):
        self.project_root = Path(__file__).resolve().parent.parent
        self.sample_request_path = self.project_root / "examples" / "sample_request.json"

    def test_sample_request_loads_successfully(self):
        """1. Verify sample_request.json exists and can be parsed as valid JSON."""
        self.assertTrue(
            self.sample_request_path.exists(),
            f"sample_request.json not found at {self.sample_request_path}",
        )
        with open(self.sample_request_path, "r", encoding="utf-8") as f:
            payload = json.load(f)

        self.assertIn("student_profile", payload)
        self.assertIn("parent_profile", payload)

    def test_run_prism_analysis_with_sample_request(self):
        """2-8. Verify run_prism_analysis accepts sample request and fulfills integration contract."""
        with open(self.sample_request_path, "r", encoding="utf-8") as f:
            payload = json.load(f)

        student_data = payload["student_profile"]
        parent_data = payload["parent_profile"]

        # Run analysis
        result = run_prism_analysis(student_data, parent_data, top_k=5)

        # 3. Result is JSON serializable
        json_str = json.dumps(result)
        self.assertIsInstance(json_str, str)
        self.assertGreater(len(json_str), 100)

        # 4. Result contains contract summary
        self.assertIn("summary", result)
        summary = result["summary"]
        self.assertIn("student_name", summary)
        self.assertIn("evaluated_careers", summary)
        self.assertIn("top_career", summary)
        self.assertIn("top_score", summary)
        self.assertIn("financial_feasibility", summary)
        self.assertIn("conflict_level", summary)

        # 5. Result contains contract conflict_analysis
        self.assertIn("conflict_analysis", result)
        conflict = result["conflict_analysis"]
        self.assertIn("index", conflict)
        self.assertIn("level", conflict)
        self.assertIn("warnings", conflict)

        # 6. Result contains contract ranked_careers
        self.assertIn("ranked_careers", result)
        ranked = result["ranked_careers"]

        # 7. Exactly 5 ranked careers returned
        self.assertEqual(len(ranked), 5)

        # 8. Careers sorted by final_score descending and contain all required contract keys
        for idx, career in enumerate(ranked, 1):
            self.assertEqual(career["rank"], idx)
            self.assertIn("career_name", career)
            self.assertIn("final_score", career)
            self.assertIn("student_fit", career)
            self.assertIn("financial_fit", career)
            self.assertIn("market_fit", career)
            self.assertIn("preference_match", career)
            self.assertIn("affordability_status", career)
            self.assertIn("conflict_level", career)
            self.assertIn("skill_gaps", career)
            self.assertIn("strengths", career)
            self.assertIn("warnings", career)
            self.assertIn("why_recommended", career)
            self.assertIn("next_steps", career)
            self.assertIn("alternative_careers", career)

            if idx < len(ranked):
                self.assertGreaterEqual(career["final_score"], ranked[idx]["final_score"])


if __name__ == "__main__":
    unittest.main()

