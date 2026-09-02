from pydantic import BaseModel
from typing import List


class PredictionRequest(BaseModel):

    age: int
    pregnancy_week: int

    systolic_bp: float
    diastolic_bp: float

    blood_sugar: float
    body_temp: float
    bmi: float
    heart_rate: float

    baby_count: int
    baby_weight: float
    baby_heart_rate: float
    cervical_length: float

    previous_complications: int
    preexisting_diabetes: int
    gestational_diabetes: int
    mental_health: int

    # Symptoms
    headache: int = 0
    nausea: int = 0
    vomiting: int = 0
    swelling: int = 0
    blurred_vision: int = 0
    bleeding: int = 0
    abdominal_pain: int = 0
    reduced_baby_movement: int = 0

    symptoms: List[str] = []


class PredictionResponse(BaseModel):

    risk_level: str

    risk_score: int
    probability: float
    probability_percent: float
    prediction_time: str
    model_version: str

    low_risk: float
    medium_risk: float
    high_risk: float

    recommendation: str

    reasons: list[str]
