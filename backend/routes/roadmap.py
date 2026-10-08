from fastapi import APIRouter, HTTPException, status
from schemas.models import Roadmap
from services.db_service import roadmap_service

import json
import os

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("/{career_id}")
def get_roadmap(career_id: str):
    try:
        # Check DB first (if MongoDB were online)
        try:
            db_item = roadmap_service.get_by_field("career_id", career_id)
            if db_item and len(db_item) > 0:
                return db_item[0]
        except Exception:
            pass # MongoDB offline, fallback to JSON
            
        file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "roadmap_data.json")
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
                # Normalize the career ID (e.g., ai-engineer -> ai_engineer)
                norm_id = career_id.replace("-", "_").lower()
                
                if norm_id in data:
                    return data[norm_id]
                
                # Demo Fallback: If roadmap doesn't exist in our limited dataset, 
                # fallback to the primary AI Engineer roadmap to prevent UI crash
                if "ai_engineer" in data:
                    return data["ai_engineer"]
                    
        raise HTTPException(status_code=404, detail="Roadmap not found for this career")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
