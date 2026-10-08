from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.database import db_instance

# Import routers
from routes.student import router as student_router
from routes.parent import router as parent_router
from routes.assessment import router as assessment_router
from routes.career import router as career_router
from routes.scholarship import router as scholarship_router
from routes.recommendation import router as recommendation_router
from routes.roadmap import router as roadmap_router
from routes.analyze import router as analyze_router
from routes.demo import router as demo_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db_instance.connect_db()
    yield
    # Shutdown
    db_instance.close_db()

app = FastAPI(
    title="PRISM Engine API",
    description="Backend API for the PRISM Career Guidance Platform",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(parent_router)
app.include_router(assessment_router)
app.include_router(career_router)
app.include_router(scholarship_router)
app.include_router(recommendation_router)
app.include_router(roadmap_router)
app.include_router(analyze_router)
app.include_router(demo_router)

@app.get("/")
def root():
    return {
        "message": "PRISM Engine API is running"
    }


@app.get("/health")
def health_check():
    status_db = "healthy" if db_instance.client is not None else "unhealthy"
    return {
        "status": "healthy",
        "database": status_db
    }