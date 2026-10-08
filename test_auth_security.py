"""
PRISM Security Test Suite
=========================
Tests authentication guards and IDOR protections via FastAPI dependency overrides.
Fully idempotent — cleans up all test UIDs before and after each run.
"""
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from main import app
from dependencies.auth import get_current_user
from services.db_service import student_service, parent_service, assessment_service

# ── Test UIDs ──────────────────────────────────────────────────────────────────
TEST_UIDS = ["sec_user_A", "sec_user_B", "sec_user_C"]

import pytest

client = TestClient(app)


def _cleanup():
    """Remove all test artefacts from every collection so runs are idempotent."""
    for uid in TEST_UIDS:
        students = student_service.get_by_field("firebase_uid", uid)
        for s in students:
            sid = str(s["_id"])
            parent_service.delete_by_field("student_id", sid)
            assessment_service.delete_by_field("student_id", sid)
        student_service.delete_by_field("firebase_uid", uid)


@pytest.fixture(autouse=True)
def run_around_tests():
    _cleanup()
    yield
    _cleanup()


# ── Helpers ────────────────────────────────────────────────────────────────────

def _as(uid: str):
    """Set dependency override to simulate a logged-in user."""
    app.dependency_overrides[get_current_user] = lambda: {"uid": uid}


def _create_student(name: str, uid: str) -> str:
    _as(uid)
    res = client.post(
        "/student/",
        json={"name": name, "age": 16, "grade": "11th Grade"},
        headers={"Authorization": "Bearer mock"},
    )
    assert res.status_code == 201, f"Failed to create student for {uid}: {res.text}"
    return res.json()["_id"]


# ── Tests ──────────────────────────────────────────────────────────────────────

def test_no_auth():
    print("Testing no authorization header...")
    # Clear overrides so the real guard runs (no Bearer header = HTTPBearer rejects it)
    app.dependency_overrides = {}
    response = client.post("/student/", json={"name": "Test", "age": 15, "grade": "10th Grade"})
    assert response.status_code in (401, 403, 422), \
        f"Expected 401/403/422, got {response.status_code}"
    print("No Auth -> 401/403 PASSED")


def test_invalid_token():
    print("Testing invalid token...")
    app.dependency_overrides = {}
    response = client.get(
        "/student/me", headers={"Authorization": "Bearer totally_invalid_token"}
    )
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("Invalid Token -> 401 PASSED")


def test_idor():
    print("Testing IDOR vulnerability...")

    student_a_id = _create_student("User A", "sec_user_A")

    # User B tries to post an assessment for User A's student_id
    _as("sec_user_B")
    res_idor = client.post(
        "/assessment/",
        json={
            "student_id": student_a_id,
            "academic_scores": {},
            "skills": {},
            "interests": {},
            "aptitude": {},
            "personality": {},
            "career_preferences": [],
        },
        headers={"Authorization": "Bearer mock"},
    )
    assert res_idor.status_code == 403, \
        f"IDOR Vulnerability! Expected 403, got {res_idor.status_code}: {res_idor.text}"
    print("IDOR (User B -> User A) -> 403 PASSED")


def test_duplicate_uid():
    print("Testing duplicate UID prevention...")
    # First create should succeed (student_a may already exist from test_idor)
    _as("sec_user_C")
    client.post(
        "/student/",
        json={"name": "User C", "age": 16, "grade": "11th Grade"},
        headers={"Authorization": "Bearer mock"},
    )

    # Second create for the same UID must return 409
    res = client.post(
        "/student/",
        json={"name": "User C Again", "age": 16, "grade": "11th Grade"},
        headers={"Authorization": "Bearer mock"},
    )
    assert res.status_code == 409, f"Expected 409 Conflict, got {res.status_code}"
    print("Duplicate UID -> 409 PASSED")


# ── Runner ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== Cleaning up previous test data ===")
    _cleanup()

    test_no_auth()
    test_invalid_token()
    test_idor()
    test_duplicate_uid()

    print("\n=== Cleaning up test data ===")
    _cleanup()
    print("All security tests PASSED [OK]")
