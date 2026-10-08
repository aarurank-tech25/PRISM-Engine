import os
import logging
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials

logger = logging.getLogger(__name__)

# Initialize Firebase Admin securely
# We only initialize if it hasn't been initialized yet
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if cred_path and os.path.exists(cred_path):
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin: {e}")
    else:
        logger.warning("FIREBASE_SERVICE_ACCOUNT_PATH not set or file missing. Firebase Auth verification will fail in production.")

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    1. Read Authorization header.
    2. Require Bearer token.
    3. Verify token using Firebase Admin SDK.
    4. Reject missing, malformed, expired, invalid tokens.
    5. Return verified Firebase user information (specifically uid).
    """
    token = credentials.credentials
    
    # Do not allow "demo" or "test" strings to bypass auth in production code.
    # Tests should use FastAPI dependency overrides instead of bypasses here.
    
    try:
        if not firebase_admin._apps:
            raise Exception("Firebase Admin not initialized.")
            
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

def verify_student_ownership(student_id: str, current_user: dict):
    """
    Verify that the authenticated Firebase UID owns the requested student_id.
    """
    from services.db_service import student_service
    student = student_service.get_by_id(student_id)
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    uid = current_user.get("uid")
    if student.get("firebase_uid") != uid:
        raise HTTPException(status_code=403, detail="Forbidden: You do not have permission to access this student record")
        
    return student
