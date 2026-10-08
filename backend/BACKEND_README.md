# PRISM Engine - Backend

This is the independent backend module for the PRISM Engine platform, built with FastAPI and MongoDB. It provides clean, modular APIs for other teammates to integrate their frontend and AI/intelligence logic.

## Architecture & Folder Structure

- `main.py`: Entry point for the FastAPI application. Registers all routes.
- `database/`: MongoDB connection setup and mock data seeding script.
- `routes/`: API endpoint definitions organized by resource.
- `schemas/`: Pydantic models for request/response validation and MongoDB integration.
- `services/`: Reusable database access logic, keeping routes clean.

## Setup Steps

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and adjust the MongoDB connection URI and database name.
   ```bash
   MONGO_URI=mongodb://localhost:27017
   DATABASE_NAME=prism_engine
   ```

## Running the Application

To start the FastAPI server, run:
```bash
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

## API Documentation

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## MongoDB Collections

- `students`
- `parents`
- `assessments`
- `careers`
- `job_market`
- `scholarships`
- `recommendations`
- `roadmap`

## What is Implemented

- Basic CRUD API structure for Student, Parent, Assessment, Career, Scholarship, Recommendation, and Roadmap entities.
- MongoDB database connection and services layer.
- Pydantic models with `ObjectId` handling.
- Basic error handling and HTTP status codes.
- Modular `APIRouter` structure.
- Mock data generation (`python database/mock_data.py`).

## What is Intentionally Left for Teammate Integration

- **AI Engine (Scoring/Ranking)**: The `POST /analyze` endpoint is a placeholder ready for the AI teammate to insert the real PRISM scoring logic.
- **Data Gathering**: Endpoints like `GET /careers` or `GET /scholarships` currently return basic mock data, awaiting actual data from the intelligence modules.
- **Frontend**: API is fully ready to be consumed by the frontend teammate's dashboard.
