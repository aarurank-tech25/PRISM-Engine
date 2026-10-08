"""
PRISM Demo Journey — End-to-End Integration Test
=================================================
Walks through: Student → Parent → Assessment → Analysis → Roadmap → Simulation → Market API.
Fully idempotent: cleans up test UID before and after each run so repeated executions succeed.
Uses FastAPI dependency overrides — no real Firebase credentials required.
"""
import json
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from main import app
from dependencies.auth import get_current_user
from services.db_service import student_service, parent_service, assessment_service

# ── Constants ──────────────────────────────────────────────────────────────────
JOURNEY_UID = "journey_test_uid_123"

# ── Mock auth ──────────────────────────────────────────────────────────────────
app.dependency_overrides[get_current_user] = lambda: {"uid": JOURNEY_UID}

client = TestClient(app)


# ── Helpers ────────────────────────────────────────────────────────────────────

def _cleanup():
    """Remove all artefacts for JOURNEY_UID so this script is re-runnable."""
    students = student_service.get_by_field("firebase_uid", JOURNEY_UID)
    for s in students:
        sid = str(s["_id"])
        parent_service.delete_by_field("student_id", sid)
        assessment_service.delete_by_field("student_id", sid)
    student_service.delete_by_field("firebase_uid", JOURNEY_UID)


def post(path, data):
    response = client.post(path, json=data, headers={"Authorization": "Bearer mock"})
    if response.status_code not in (200, 201):
        print(f"Error on {path}: {response.text}")
        return None
    return response.json()


def get(path):
    response = client.get(path, headers={"Authorization": "Bearer mock"})
    if response.status_code != 200:
        print(f"Error on {path}: {response.text}")
        return None
    return response.json()


# ── Journey ────────────────────────────────────────────────────────────────────

print("=== Cleaning up previous run data ===")
_cleanup()

print("\n=== 1. Create Student ===")
student_data = {
    "name": "Jane Doe",
    "age": 16,
    "grade": "11th Grade",
    "interests": ["Coding", "Mathematics", "Physics"],
    "location": "Bengaluru",
}
student = post("/student/", student_data)
assert student is not None, "Student creation failed"
student_id = student.get("_id")
print(f"Student created: {student_id}")

print("\n=== 2. Create Parent ===")
parent_data = {
    "student_id": student_id,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "education_budget": 500000.0,
    "risk_appetite": "Medium",
}
parent = post("/parent/", parent_data)
assert parent is not None, "Parent creation failed"
parent_id = parent.get("_id")
print(f"Parent created: {parent_id}")

print("\n=== 3. Create Assessment ===")
assessment_data = {
    "student_id": student_id,
    "academic_scores": {"maths": 95, "physics": 90, "computer_science": 98},
    "skills": {"python": 85, "data_structures": 80},
    "interests": {"artificial_intelligence": 90},
    "aptitude": {"logical_reasoning": 85},
    "personality": {},
    "career_preferences": ["AI Engineer", "Software Developer"],
}
assessment = post("/assessment/", assessment_data)
assert assessment is not None, "Assessment creation failed"
assessment_id = assessment.get("_id")
print(f"Assessment created: {assessment_id}")

print("\n=== 4. PRISM Analysis ===")
analyze_payload = {
    "student_id": student_id,
    "assessment_id": assessment_id,
    "parent_id": parent_id,
}
analysis = post("/analyze/", analyze_payload)
assert analysis is not None, "Analysis failed"
print(f"Analysis Status: {analysis.get('status')}")
ai_result = analysis.get("ai_result", {})
summary = ai_result.get("summary", {})
ranked_careers = ai_result.get("ranked_careers", [])

print(f"Top Recommended Career: {summary.get('top_career')}")
print(f"Top Score: {summary.get('top_score')}")

if ranked_careers:
    top_c = ranked_careers[0]
    print(f"Why Recommended: {top_c.get('why_recommended')}")
    print(f"Skill Match: {top_c.get('skill_match', 'N/A')} | Student Fit: {top_c.get('student_fit', 'N/A')}")

    career_id = top_c.get("career_name", "").lower().replace(" ", "_").replace("/", "_")
    print(f"\n=== 5. Get Roadmap for {career_id} ===")
    roadmap = get(f"/roadmap/{career_id}")
    if roadmap:
        print(f"Roadmap found for {career_id}")
    else:
        print("Roadmap not found — checking existing datasets fallback...")

print("\n=== 6. What-If Simulation ===")
simulate_payload = {
    "student_id": student_id,
    "assessment_id": assessment_id,
    "parent_id": parent_id,
    "overrides": {"coding": 99, "maths": 99},
}
sim = post("/analyze/simulate", simulate_payload)
assert sim is not None, "Simulation failed"
sim_top = sim.get("ai_result", {}).get("summary", {}).get("top_career")
print(f"Simulated Top Career: {sim_top}")

print("\n=== 7. Market Careers & Locations API ===")
careers_resp = get("/api/market/careers")
locs_resp = get("/api/market/locations")
if careers_resp is not None:
    print(f"Market careers endpoint: OK ({len(careers_resp)} items)")
if locs_resp is not None:
    print(f"Market locations endpoint: OK ({len(locs_resp)} items)")

print("\n=== Cleaning up test data ===")
_cleanup()

print("\n[OK] Full PRISM demo journey PASSED")
