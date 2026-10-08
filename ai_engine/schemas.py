"""PRISM AI - Profile Schemas and Validation Helpers.

Purpose:
--------
Defines clear, beginner-friendly data structures and validation utilities for:
- StudentProfile
- ParentProfile

Provides type safety, automatic score clamping (0-100), and graceful fallback
for missing or optional fields.
"""

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List

from .normalization import (
    clamp_score,
    normalize_parent_profile,
    normalize_student_profile,
)


@dataclass
class StudentProfile:
    """Represents a student's academic performance, skills, interests, and preferences."""

    name: str = "Student"
    age: int = 18
    education_level: str = "High School"
    location: str = "General"
    academic_scores: Dict[str, float] = field(default_factory=dict)
    skills: Dict[str, float] = field(default_factory=dict)
    interests: Dict[str, float] = field(default_factory=dict)
    aptitude: Dict[str, float] = field(default_factory=dict)
    personality: Dict[str, float] = field(default_factory=dict)
    career_preferences: List[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: Dict[str, Any] | None) -> "StudentProfile":
        """Instantiate and validate a StudentProfile from an arbitrary dictionary."""
        normalized = normalize_student_profile(data)
        return cls(
            name=normalized["name"],
            age=normalized["age"],
            education_level=normalized["education_level"],
            location=normalized["location"],
            academic_scores=normalized["academic_scores"],
            skills=normalized["skills"],
            interests=normalized["interests"],
            aptitude=normalized["aptitude"],
            personality=normalized["personality"],
            career_preferences=normalized["career_preferences"],
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert the profile to a clean dictionary."""
        return asdict(self)


@dataclass
class ParentProfile:
    """Represents parent/family financial parameters, preferences, and constraints."""

    annual_income: float = 500000.0
    education_budget: float = 175000.0
    risk_appetite: str = "medium"
    preferred_location: str = "Flexible"
    parent_career_preferences: List[str] = field(default_factory=list)
    relocation_allowed: bool = True

    @classmethod
    def from_dict(cls, data: Dict[str, Any] | None) -> "ParentProfile":
        """Instantiate and validate a ParentProfile from an arbitrary dictionary."""
        normalized = normalize_parent_profile(data)
        return cls(
            annual_income=normalized["annual_income"],
            education_budget=normalized["education_budget"],
            risk_appetite=normalized["risk_appetite"],
            preferred_location=normalized["preferred_location"],
            parent_career_preferences=normalized["parent_career_preferences"],
            relocation_allowed=normalized["relocation_allowed"],
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert the profile to a clean dictionary."""
        return asdict(self)


def validate_analysis_input(
    student_data: Any, parent_data: Any = None
) -> tuple[Dict[str, Any], Dict[str, Any]]:
    """Validate and sanitize raw student and parent input payloads into clean dictionaries.

    Accepts either dataclass instances or standard python dicts.
    """
    if isinstance(student_data, StudentProfile):
        student_dict = student_data.to_dict()
    else:
        student_dict = StudentProfile.from_dict(student_data).to_dict()

    if isinstance(parent_data, ParentProfile):
        parent_dict = parent_data.to_dict()
    else:
        parent_dict = ParentProfile.from_dict(parent_data).to_dict()

    return student_dict, parent_dict
