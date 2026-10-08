from fastapi import APIRouter, HTTPException, status
from schemas.models import Recommendation
from services.db_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/", response_model=list[Recommendation])
def get_recommendations():
    try:
        return recommendation_service.get_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
