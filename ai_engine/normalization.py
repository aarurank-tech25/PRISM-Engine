"""PRISM AI - Normalization Utilities.

Purpose:
--------
Provides robust, reusable normalization and sanitization functions for student,
parent, and career profiles. Ensures all values are deterministically clamped to 0-100,
handles missing or corrupted inputs gracefully, and offers keyword-based fuzzy matching.
"""

import re
from typing import Any, Dict, List, Tuple


def clamp_score(val: Any, default: float = 0.0, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Normalize any arbitrary value to a valid float within [min_val, max_val].

    Handles:
    - None or empty string -> default
    - Boolean (False -> 0, True -> 100 or default)
    - String representations of numbers (e.g. "85", "92.5")
    - Fractions in [0.0, 1.0] -> scaled to [0.0, 100.0] if max_val is 100
    - Clamps values outside [min_val, max_val]
    """
    if val is None or val == "":
        return round(float(default), 2)

    try:
        if isinstance(val, bool):
            numeric_val = 100.0 if val else 0.0
        else:
            numeric_val = float(val)
    except (ValueError, TypeError):
        return round(float(default), 2)

    # Scale 0.0 - 1.0 fractions to 0.0 - 100.0 if target max is 100
    if max_val == 100.0 and 0.0 < numeric_val <= 1.0:
        numeric_val *= 100.0

    clamped = max(min_val, min(max_val, numeric_val))
    return round(clamped, 2)


def normalize_token(text: str) -> str:
    """Sanitize and normalize a text token (lowercase, replace separators, trim, strip punctuation)."""
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    # Replace underscores, hyphens, and slashes with spaces to tokenize uniformly
    text = text.replace("_", " ").replace("-", " ").replace("/", " ")
    cleaned = re.sub(r"[^\w\s]", "", text.strip().lower())
    # Collapse multiple spaces
    return " ".join(cleaned.split())


# Domain-specific synonym / equivalence map for matching skills, interests, and careers
SYNONYM_MAP: Dict[str, List[str]] = {
    "python": ["python", "python programming", "py"],
    "machine learning": ["machine learning", "ml", "ai", "artificial intelligence", "deep learning", "data science"],
    "artificial intelligence": ["ai", "artificial intelligence", "machine learning", "deep tech", "data scientist", "data science"],
    "data science": ["data science", "data scientist", "data analytics", "machine learning", "ai", "artificial intelligence", "analytics"],
    "software": ["software", "coding", "programming", "software engineering", "software development", "computer science"],
    "logical reasoning": ["logical reasoning", "logical thinking", "logic", "analytical reasoning", "problem solving"],
    "numerical": ["numerical", "mathematical ability", "maths", "mathematics", "quantitative"],
    "analytical": ["analytical", "analytical reasoning", "analysis", "critical thinking"],
    "design": ["design", "uiux", "product design", "visual design", "wireframing"],
    "creative": ["creative", "creativity", "creative thinking", "art"],
    "engineering": ["engineering", "engineer", "software", "mechatronics", "biomedical", "cloud"],
}


def compute_token_similarity(term_a: str, term_b: str) -> float:
    """Calculate deterministic similarity between two terms (0.0 to 1.0)."""
    norm_a = normalize_token(term_a)
    norm_b = normalize_token(term_b)

    if not norm_a or not norm_b:
        return 0.0

    if norm_a == norm_b:
        return 1.0

    # Direct substring containment with high threshold
    if norm_a in norm_b or norm_b in norm_a:
        shorter = min(len(norm_a), len(norm_b))
        longer = max(len(norm_a), len(norm_b))
        ratio = round(shorter / longer, 2)
        return max(0.70, ratio)

    # Check synonym mapping
    for canonical, synonyms in SYNONYM_MAP.items():
        in_a = any(syn in norm_a.split() or syn == norm_a for syn in synonyms)
        in_b = any(syn in norm_b.split() or syn == norm_b for syn in synonyms)
        if in_a and in_b:
            return 0.75

    # Token overlap (Jaccard similarity on words)
    tokens_a = set(norm_a.split())
    tokens_b = set(norm_b.split())
    if tokens_a and tokens_b:
        intersection = tokens_a.intersection(tokens_b)
        union = tokens_a.union(tokens_b)
        if intersection:
            return round(len(intersection) / len(union), 2)

    return 0.0


def find_best_score_in_dict(target_key: str, score_dict: Dict[str, Any], default: float = 0.0) -> Tuple[float, str]:
    """Find the best matching score from a user dictionary for a given target key.

    Returns:
        (matched_score, matched_key_name)
    """
    if not isinstance(score_dict, dict) or not score_dict:
        return (default, "")

    best_match_key = ""
    best_similarity = 0.0
    best_score = default

    for candidate_key, raw_val in score_dict.items():
        sim = compute_token_similarity(target_key, candidate_key)
        if sim > best_similarity and sim >= 0.5:
            best_similarity = sim
            best_match_key = candidate_key
            best_score = clamp_score(raw_val, default=default)

    if best_similarity >= 0.5:
        return (best_score, best_match_key)

    return (default, "")


def normalize_student_profile(profile: Dict[str, Any] | None) -> Dict[str, Any]:
    """Sanitize and enforce schema and 0-100 clamping on student profile inputs."""
    if not isinstance(profile, dict):
        profile = {}

    def _sanitize_dict(d: Any) -> Dict[str, float]:
        if not isinstance(d, dict):
            return {}
        return {k: clamp_score(v) for k, v in d.items()}

    def _sanitize_list(lst: Any) -> List[str]:
        if not isinstance(lst, list):
            return []
        return [str(item).strip() for item in lst if item]

    return {
        "name": str(profile.get("name") or "Student"),
        "age": int(profile.get("age", 18)) if isinstance(profile.get("age"), (int, float, str)) and str(profile.get("age")).isdigit() else 18,
        "education_level": str(profile.get("education_level") or "High School"),
        "location": str(profile.get("location") or "General"),
        "academic_scores": _sanitize_dict(profile.get("academic_scores")),
        "skills": _sanitize_dict(profile.get("skills")),
        "interests": _sanitize_dict(profile.get("interests")),
        "aptitude": _sanitize_dict(profile.get("aptitude")),
        "personality": _sanitize_dict(profile.get("personality")),
        "career_preferences": _sanitize_list(profile.get("career_preferences")),
    }


def normalize_parent_profile(profile: Dict[str, Any] | None) -> Dict[str, Any]:
    """Sanitize and enforce schema on parent/family profile inputs."""
    if not isinstance(profile, dict):
        profile = {}

    def _sanitize_number(val: Any, default: float) -> float:
        try:
            return max(0.0, float(val))
        except (ValueError, TypeError):
            return default

    def _sanitize_list(lst: Any) -> List[str]:
        if not isinstance(lst, list):
            return []
        return [str(item).strip() for item in lst if item]

    annual_income = _sanitize_number(profile.get("annual_income"), default=500000.0)
    education_budget = _sanitize_number(
        profile.get("education_budget"), default=round(annual_income * 0.35, 2)
    )

    return {
        "annual_income": annual_income,
        "education_budget": education_budget,
        "risk_appetite": str(profile.get("risk_appetite") or "medium").lower(),
        "preferred_location": str(profile.get("preferred_location") or "Flexible"),
        "parent_career_preferences": _sanitize_list(profile.get("parent_career_preferences")),
        "relocation_allowed": bool(profile.get("relocation_allowed", True)),
    }
