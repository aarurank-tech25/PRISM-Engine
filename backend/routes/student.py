from fastapi import APIRouter, HTTPException, status, Depends
from schemas.models import Student, StudentCreate
from services.db_service import student_service
from dependencies.auth import get_current_user

router = APIRouter(prefix="/student", tags=["Student"])

@router.get("/me", response_model=Student)
def get_my_student(current_user: dict = Depends(get_current_user)):
    """
    Returns the student profile for the currently authenticated Firebase user.
    """
    uid = current_user.get("uid")
    # Search for student by firebase_uid
    students = student_service.get_by_field("firebase_uid", uid)
    if not students:
        raise HTTPException(status_code=404, detail="Student profile not found for this authenticated user.")
    
    return students[0]

@router.post("/", response_model=Student, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, current_user: dict = Depends(get_current_user)):
    """
    Create a new student profile and link it to the verified Firebase UID.
    """
    uid = current_user.get("uid")
    
    # Check if a student already exists for this UID
    existing = student_service.get_by_field("firebase_uid", uid)
    if existing:
        raise HTTPException(status_code=409, detail="A student profile already exists for this user.")
        
    try:
        data = student.model_dump()
        # Force the firebase_uid to be the authenticated one, ignoring any client payload
        data["firebase_uid"] = uid
        created = student_service.create(data)
        return created
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[Student])
def get_students(current_user: dict = Depends(get_current_user)):
    """
    For security, list is restricted or could just return the user's own student.
    We will return just the user's own student to avoid leaking data, 
    or we can restrict this to admin only. 
    For now, return only the student matching the uid to prevent full DB dumps.
    """
    uid = current_user.get("uid")
    return student_service.get_by_field("firebase_uid", uid)
