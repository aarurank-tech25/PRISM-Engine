"""PRISM AI Engine Package.

This package contains the core intelligence and analytical components of the
PRISM career assessment engine:
- scoring: Multi-dimensional score calculation.
- career_matcher: Matching student profiles with careers database.
- conflict: Identification of aspiration-aptitude and resource conflicts.
- recommendation: Generation of tailored career recommendations and action plans.
- schemas: Data structures and validation for StudentProfile & ParentProfile.
- pipeline: End-to-end analysis orchestration via `run_prism_analysis` & `serialize_prism_result`.
"""

from .career_matcher import CareerMatcher
from .conflict import ConflictDetector
from .normalization import (
    clamp_score,
    normalize_parent_profile,
    normalize_student_profile,
)
from .pipeline import run_prism_analysis, serialize_prism_result
from .recommendation import RecommendationEngine
from .schemas import ParentProfile, StudentProfile, validate_analysis_input
from .scoring import ScoringEngine

__all__ = [
    "ScoringEngine",
    "CareerMatcher",
    "ConflictDetector",
    "RecommendationEngine",
    "StudentProfile",
    "ParentProfile",
    "validate_analysis_input",
    "run_prism_analysis",
    "serialize_prism_result",
    "clamp_score",
    "normalize_student_profile",
    "normalize_parent_profile",
]
