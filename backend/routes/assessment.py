from fastapi import APIRouter, HTTPException, status, Depends
from schemas.models import Assessment, AssessmentCreate
from services.db_service import assessment_service
from dependencies.auth import get_current_user, verify_student_ownership

router = APIRouter(prefix="/assessment", tags=["Assessment"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_assessment(assessment: AssessmentCreate, current_user: dict = Depends(get_current_user)):
    try:
        # Prevent IDOR: Ensure the student_id provided belongs to the authenticated user
        verify_student_ownership(assessment.student_id, current_user)
        
        created = assessment_service.create(assessment.model_dump())
        return created
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

