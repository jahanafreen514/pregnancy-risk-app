import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))


def predict_risk(data):

    features = np.array([[
        data.age,
        data.systolic_bp,
        data.diastolic_bp,
        data.blood_sugar,
        data.body_temp,
        data.bmi,
        data.heart_rate,
        data.previous_complications,
        data.preexisting_diabetes,
        data.gestational_diabetes,
        data.mental_health,
        data.pregnancy_week,
        data.baby_count,
        data.baby_weight,
        data.baby_heart_rate,
        data.cervical_length,
        data.headache,
        data.nausea,
        data.vomiting,
        data.swelling,
        data.blurred_vision,
        data.bleeding,
        data.abdominal_pain,
        data.reduced_baby_movement
    ]])

    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    risk = encoder.inverse_transform([prediction])[0]

    result = {
        "risk_level": risk,
        "confidence": round(float(max(probabilities)), 4),
        "low_risk": 0,
        "medium_risk": 0,
        "high_risk": 0,
    }

    for label, prob in zip(encoder.classes_, probabilities):
        key = f"{label.lower()}_risk"
        result[key] = round(float(prob) * 100, 2)

    return result