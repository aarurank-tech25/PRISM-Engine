from fastapi import APIRouter, HTTPException, status, Depends
from schemas.models import Parent, ParentCreate
from services.db_service import parent_service
from dependencies.auth import get_current_user, verify_student_ownership

router = APIRouter(prefix="/parent", tags=["Parent"])

@router.post("/", response_model=Parent, status_code=status.HTTP_201_CREATED)
def create_parent(parent: ParentCreate, current_user: dict = Depends(get_current_user)):
    try:
        # Prevent IDOR: Ensure the student_id provided belongs to the authenticated user
        verify_student_ownership(parent.student_id, current_user)
        
        created = parent_service.create(parent.model_dump())
        return created
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

