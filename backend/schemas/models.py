from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from .objectid import PyObjectId

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class StudentBase(BaseModel):
    firebase_uid: Optional[str] = None
    name: str
    age: int
    grade: str
    location: Optional[str] = "India"
    interests: List[str] = []

class StudentCreate(StudentBase):
    pass

class Student(MongoBaseModel, StudentBase):
    pass


class ParentBase(BaseModel):
    student_id: str
    name: str
    email: str
    phone: Optional[str] = None
    annual_income: Optional[float] = None
    education_budget: Optional[float] = None
    risk_appetite: Optional[str] = "Medium"
    preferred_location: Optional[str] = None
    relocation_preference: Optional[bool] = False

class ParentCreate(ParentBase):
    pass

class Parent(MongoBaseModel, ParentBase):
    pass


class AssessmentBase(BaseModel):
    student_id: str
    academic_scores: Dict[str, float] = Field(default_factory=dict)
    skills: Dict[str, float] = Field(default_factory=dict)
    interests: Dict[str, float] = Field(default_factory=dict)
    aptitude: Dict[str, float] = Field(default_factory=dict)
    personality: Dict[str, float] = Field(default_factory=dict)
    career_preferences: List[str] = Field(default_factory=list)
    feedback: Optional[str] = None

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(MongoBaseModel, AssessmentBase):
    pass


class CareerBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    average_salary: Optional[str] = None

class CareerCreate(CareerBase):
    pass

class Career(MongoBaseModel, CareerBase):
    pass


class ScholarshipBase(BaseModel):
    name: str
    amount: str
    eligibility_criteria: str
    deadline: Optional[str] = None

class ScholarshipCreate(ScholarshipBase):
    pass

class Scholarship(MongoBaseModel, ScholarshipBase):
    pass


class RecommendationBase(BaseModel):
    student_id: str
    recommended_careers: List[str] = []
    recommended_scholarships: List[str] = []
    notes: Optional[str] = None

class RecommendationCreate(RecommendationBase):
    pass

class Recommendation(MongoBaseModel, RecommendationBase):
    pass


class RoadmapBase(BaseModel):
    career_id: str
    steps: List[str] = []

class RoadmapCreate(RoadmapBase):
    pass

class Roadmap(MongoBaseModel, RoadmapBase):
    pass
