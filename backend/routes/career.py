from fastapi import APIRouter, HTTPException, status
from schemas.models import Career, CareerCreate
from services.db_service import career_service

router = APIRouter(prefix="/careers", tags=["Careers"])

@router.get("/", response_model=list[Career])
def get_careers():
    try:
        return career_service.get_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
