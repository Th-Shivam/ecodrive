# EcoDrive Backend API

A FastAPI backend service for analyzing driving patterns and calculating eco-scores.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /analyze-driving

Analyzes driving data and returns an eco-score.

Request body:
```json
{
    "speed": [50.0, 55.0, 45.0],
    "acceleration": [2.0, 1.5, -1.0],
    "braking": [0.5, 0.3, 0.8],
    "timestamp": "2024-02-20T10:00:00",
    "trip_id": "trip123"
}
```

Response:
```json
{
    "eco_score": 75.5,
    "trip_id": "trip123",
    "timestamp": "2024-02-20T10:00:01",
    "analysis": {
        "average_speed": 50.0,
        "average_acceleration": 0.83,
        "average_braking": 0.53,
        "speed_variability": 0.25,
        "acceleration_variability": 0.35,
        "braking_variability": 0.15,
        "recommendations": [
            "Maintain steady speed between 45-55 km/h",
            "Use regenerative braking more effectively",
            "Avoid sudden acceleration"
        ]
    }
}
```

### GET /

Welcome endpoint that returns API information.

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc` 