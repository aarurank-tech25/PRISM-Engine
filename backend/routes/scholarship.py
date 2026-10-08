from fastapi import APIRouter, HTTPException, status
from schemas.models import Scholarship
from services.db_service import scholarship_service

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])

@router.get("/", response_model=list[Scholarship])
def get_scholarships():
    try:
        return scholarship_service.get_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
