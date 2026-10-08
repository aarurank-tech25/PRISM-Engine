from services.db_service import (
    student_service,
    parent_service,
    assessment_service,
    career_service,
    scholarship_service,
    recommendation_service,
    roadmap_service
)
import logging

logger = logging.getLogger(__name__)

def seed_mock_data():
    logger.info("Seeding mock data...")
    
    # Students
    if not student_service.get_all():
        student_service.create({
            "name": "Alex Johnson",
            "age": 16,
            "grade": "11th",
            "interests": ["Robotics", "Math"]
        })
    
    # Careers
    if not career_service.get_all():
        career_service.create({
            "title": "Robotics Engineer",
            "description": "Design and build robotic systems.",
            "required_skills": ["Python", "C++", "Physics", "Math"],
            "average_salary": "$90,000"
        })
        career_service.create({
            "title": "Data Scientist",
            "description": "Analyze large datasets to extract insights.",
            "required_skills": ["Python", "Statistics", "Machine Learning"],
            "average_salary": "$100,000"
        })
    
    # Scholarships
    if not scholarship_service.get_all():
        scholarship_service.create({
            "name": "Future Innovators Tech Scholarship",
            "amount": "$5,000",
            "eligibility_criteria": "High school seniors interested in STEM.",
            "deadline": "2024-12-31"
        })
        
    logger.info("Mock data seeding complete.")

if __name__ == "__main__":
    from database.database import db_instance
    db_instance.connect_db()
    if db_instance.client:
        seed_mock_data()
        db_instance.close_db()
    else:
        logger.error("Could not connect to database to seed mock data.")
