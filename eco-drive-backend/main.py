from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import random
from datetime import datetime

app = FastAPI(
    title="EcoDrive API",
    description="API for analyzing driving patterns and calculating eco-scores",
    version="1.0.0"
)

class DrivingData(BaseModel):
    speed: List[float]  # Speed measurements in km/h
    acceleration: List[float]  # Acceleration measurements in m/s²
    braking: List[float]  # Braking force measurements in m/s²
    timestamp: datetime
    trip_id: str

class EcoScoreResponse(BaseModel):
    eco_score: float
    trip_id: str
    timestamp: datetime
    analysis: dict

@app.post("/analyze-driving", response_model=EcoScoreResponse)
async def analyze_driving(data: DrivingData):
    try:
        # Calculate average speed
        avg_speed = sum(data.speed) / len(data.speed)
        
        # Calculate average acceleration
        avg_acceleration = sum(data.acceleration) / len(data.acceleration)
        
        # Calculate average braking
        avg_braking = sum(data.braking) / len(data.braking)
        
        # Generate a random eco-score between 40 and 90
        eco_score = round(random.uniform(40, 90), 2)
        
        # Create analysis details
        analysis = {
            "average_speed": round(avg_speed, 2),
            "average_acceleration": round(avg_acceleration, 2),
            "average_braking": round(avg_braking, 2),
            "speed_variability": round(random.uniform(0.1, 0.5), 2),
            "acceleration_variability": round(random.uniform(0.1, 0.5), 2),
            "braking_variability": round(random.uniform(0.1, 0.5), 2),
            "recommendations": [
                "Maintain steady speed between 45-55 km/h",
                "Use regenerative braking more effectively",
                "Avoid sudden acceleration"
            ]
        }
        
        return EcoScoreResponse(
            eco_score=eco_score,
            trip_id=data.trip_id,
            timestamp=datetime.now(),
            analysis=analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Welcome to EcoDrive API",
        "version": "1.0.0",
        "endpoints": {
            "analyze-driving": "/analyze-driving"
        }
    } 