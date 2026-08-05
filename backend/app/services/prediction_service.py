import os
import joblib
import numpy as np
import xgboost as xgb


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)
model = xgb.XGBClassifier()

model.load_model(
    os.path.join(BASE_DIR, "ml", "model.json")
)



# # Load trained model
# model = joblib.load(
#     os.path.join(BASE_DIR, "ml", "model.pkl")
# )


# Load label encoder
encoder = joblib.load(
    os.path.join(BASE_DIR, "ml", "label_encoder.pkl")
)


def calculate_prediction(data):

    # -----------------------------
    # Features for ML model
    # -----------------------------
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

    # -----------------------------
    # ML Prediction
    # -----------------------------
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    predicted_label = encoder.inverse_transform(
        [prediction]
    )[0]

    # -----------------------------
    # Result Object
    # -----------------------------
    result = {

        "risk_level": predicted_label,

        "risk_score": 0,

        "low_risk": 0,
        "medium_risk": 0,
        "high_risk": 0,

        "recommendation": "",

        "reasons": []
    }

    # -----------------------------
    # Save ML probabilities
    # -----------------------------
    for label, probability in zip(
        encoder.classes_,
        probabilities
    ):

        result[f"{label.lower()}_risk"] = round(
            float(probability) * 100,
            2
        )

    # ===================================================
    # CLINICAL RISK SCORE (0-100)
    # ===================================================

    risk_score = 0

    # Age
    if data.age >= 35:
        risk_score += 10

    # Blood Pressure
    if data.systolic_bp >= 160 or data.diastolic_bp >= 110:
        risk_score += 25

    elif data.systolic_bp >= 140 or data.diastolic_bp >= 90:
        risk_score += 15

    # Blood Sugar
    if data.blood_sugar >= 200:
        risk_score += 20

    elif data.blood_sugar >= 140:
        risk_score += 10

    # BMI
    if data.bmi >= 35:
        risk_score += 10

    elif data.bmi >= 30:
        risk_score += 5

    # Body Temperature
    if data.body_temp >= 38:
        risk_score += 10

    # Heart Rate
    if data.heart_rate >= 120 or data.heart_rate <= 50:
        risk_score += 10

    # Previous Complications
    if data.previous_complications:
        risk_score += 15

    # Diabetes
    if data.preexisting_diabetes:
        risk_score += 15

    if data.gestational_diabetes:
        risk_score += 10

    # Mental Health
    if data.mental_health:
        risk_score += 5

    # Baby Heart Rate
    if (
        data.baby_heart_rate < 110 or
        data.baby_heart_rate > 160
    ):
        risk_score += 15

    # Cervical Length
    if data.cervical_length < 2.5:
        risk_score += 15

    # Symptoms
    if data.headache:
        risk_score += 5

    if data.nausea:
        risk_score += 3

    if data.vomiting:
        risk_score += 5

    if data.swelling:
        risk_score += 10

    if data.blurred_vision:
        risk_score += 15

    if data.bleeding:
        risk_score += 25

    if data.abdominal_pain:
        risk_score += 10

    if data.reduced_baby_movement:
        risk_score += 20

    # Pregnancy Week
    if data.pregnancy_week >= 36:
        risk_score += 5

    # Limit to 100
    risk_score = min(risk_score, 100)
        # ==========================================
    # Determine Risk Level from Clinical Score
    # ==========================================

    if risk_score >= 70:
        risk_level = "High"

    elif risk_score >= 35:
        risk_level = "Medium"

    else:
        risk_level = "Low"


    # Save calculated values
    result["risk_level"] = risk_level
    result["risk_score"] = int(risk_score)


    # ==========================================
    # Recommendations
    # ==========================================

    if risk_level == "High":

        result["recommendation"] = (
            "Immediate hospital consultation is recommended. "
            "Please contact your healthcare provider immediately."
        )

        result["reasons"] = [
            "Multiple high-risk maternal indicators detected.",
            "Close medical supervision is required."
        ]


    elif risk_level == "Medium":

        result["recommendation"] = (
            "Regular monitoring and doctor follow-up "
            "is recommended."
        )

        result["reasons"] = [
            "Moderate pregnancy risk detected.",
            "Regular prenatal monitoring is advised."
        ]


    else:

        result["recommendation"] = (
            "Continue regular prenatal care, maintain a balanced diet, "
            "stay hydrated and attend scheduled check-ups."
        )

        result["reasons"] = [
            "Overall pregnancy condition appears stable."
        ]

    return result