import json
from pathlib import Path
import joblib
import numpy as np
import xgboost as xgb


BASE_DIR = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = BASE_DIR / "ml"

for artifact_name in ("model.json", "label_encoder.pkl", "features.pkl", "model_metadata.json"):
    if not (ARTIFACT_DIR / artifact_name).is_file():
        raise RuntimeError(f"ML model artifact missing: {ARTIFACT_DIR / artifact_name}")

model = xgb.XGBClassifier()
model.load_model(str(ARTIFACT_DIR / "model.json"))



# # Load trained model
# model = joblib.load(
#     os.path.join(BASE_DIR, "ml", "model.pkl")
# )


# Load label encoder
encoder = joblib.load(ARTIFACT_DIR / "label_encoder.pkl")
FEATURE_NAMES = joblib.load(ARTIFACT_DIR / "features.pkl")
MODEL_METADATA = json.loads((ARTIFACT_DIR / "model_metadata.json").read_text(encoding="utf-8"))
MODEL_VERSION = MODEL_METADATA.get("model_version", "glowcare-pregnancy-risk-v1.0")
EXPECTED_CLASSES = {"low", "medium", "high"}
if len(FEATURE_NAMES) != 24 or model.n_features_in_ != len(FEATURE_NAMES):
    raise RuntimeError("ML model feature contract is invalid.")
if {str(value).casefold() for value in encoder.classes_} != EXPECTED_CLASSES:
    raise RuntimeError(f"ML model class contract is invalid: {encoder.classes_.tolist()}")


def validate_loaded_model() -> None:
    """Startup check called by the application lifespan; never trains a model."""
    if not MODEL_VERSION or not FEATURE_NAMES:
        raise RuntimeError("ML model metadata is invalid")


def _normalise_measurements(data):
    """Return values in the units used by the saved ML model and clinical rules.

    The assessment form collects glucose in mg/dL, temperature in Celsius and
    cervical length in millimetres.  The training dataset, however, uses
    mmol/L, Fahrenheit and centimetres.  Passing the form values straight to
    the model made otherwise normal readings look far outside its training
    range and commonly produced an unhelpful 0% result.

    The checks also accept dataset/API values already supplied in the model's
    units, which keeps existing API clients working.
    """
    glucose_mg_dl = float(data.blood_sugar)
    if glucose_mg_dl <= 30:  # Already mmol/L (the model dataset convention).
        glucose_mg_dl *= 18.0

    temperature_c = float(data.body_temp)
    if temperature_c >= 45:  # Already Fahrenheit (the model dataset convention).
        temperature_c = (temperature_c - 32.0) * 5.0 / 9.0

    cervical_length_cm = float(data.cervical_length)
    if cervical_length_cm > 10:  # Form value is millimetres.
        cervical_length_cm /= 10.0

    return {
        "model_blood_sugar": glucose_mg_dl / 18.0,
        "model_body_temp": (temperature_c * 9.0 / 5.0) + 32.0,
        "clinical_blood_sugar": glucose_mg_dl,
        "clinical_body_temp": temperature_c,
        "cervical_length_cm": cervical_length_cm,
    }


def calculate_prediction(data):

    measurements = _normalise_measurements(data)
    reported_symptoms = {
        str(symptom).strip().casefold() for symptom in (data.symptoms or [])
    }

    # -----------------------------
    # Features for ML model
    # -----------------------------
    feature_values = {
        "Age": data.age, "Systolic BP": data.systolic_bp,
        "Diastolic": data.diastolic_bp, "BS": measurements["model_blood_sugar"],
        "Body Temp": measurements["model_body_temp"], "BMI": data.bmi,
        "Heart Rate": data.heart_rate,
        "Previous Complications": data.previous_complications,
        "Preexisting Diabetes": data.preexisting_diabetes,
        "Gestational Diabetes": data.gestational_diabetes,
        "Mental Health": data.mental_health, "Pregnancy Week": data.pregnancy_week,
        "Baby Count": data.baby_count, "Baby Weight": data.baby_weight,
        "Baby Heart Rate": data.baby_heart_rate,
        "Cervical Length": measurements["cervical_length_cm"],
        "Headache": data.headache, "Nausea": data.nausea, "Vomiting": data.vomiting,
        "Swelling": data.swelling, "Blurred Vision": data.blurred_vision,
        "Bleeding": data.bleeding, "Abdominal Pain": data.abdominal_pain,
        "Reduced Baby Movement": data.reduced_baby_movement,
    }
    if set(FEATURE_NAMES) != set(feature_values):
        raise RuntimeError("Prediction feature mapping no longer matches the trained model.")
    features = np.asarray([[feature_values[name] for name in FEATURE_NAMES]], dtype=float)

    # -----------------------------
    # ML Prediction
    # -----------------------------
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    predicted_label = str(encoder.inverse_transform([prediction])[0]).title()
    predicted_probability = float(probabilities[int(prediction)])

    # -----------------------------
    # Result Object
    # -----------------------------
    result = {

        "risk_level": predicted_label,

        "probability": predicted_probability,
        "probability_percent": round(predicted_probability * 100, 2),
        "model_version": MODEL_VERSION,

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
    # CLINICAL SCREENING SCORE (0-100; not a probability)
    # ===================================================
    # The model was trained on a synthetic dataset, so its class probabilities
    # must not override clinical triage.  This score uses recognised maternal
    # warning thresholds and combines vital signs, pregnancy history and
    # symptoms.  It is an aid to seek care, never a diagnosis.
    risk_score = 0
    clinical_reasons = []
    urgent = False
    critical_indicator_count = 0

    def add(points, reason):
        nonlocal risk_score
        risk_score += points
        clinical_reasons.append(reason)

    # Hypertension in pregnancy: 140/90 needs prompt assessment; 160/110 is
    # severe-range and needs urgent assessment.
    if data.systolic_bp >= 160 or data.diastolic_bp >= 110:
        add(65, "Severe-range blood pressure (160/110 or higher).")
        urgent = True
        critical_indicator_count += 1
    elif data.systolic_bp >= 140 or data.diastolic_bp >= 90:
        add(30, "Raised blood pressure (140/90 or higher).")

    glucose = measurements["clinical_blood_sugar"]
    if glucose >= 200:
        add(35, "Very high blood glucose needs same-day clinical advice.")
    elif glucose >= 140:
        add(30, "Blood glucose is above the form's screening range.")

    temperature = measurements["clinical_body_temp"]
    if temperature >= 39:
        add(30, "High fever (39°C or higher).")
    elif temperature >= 38:
        add(15, "Fever (38°C or higher).")

    if data.heart_rate >= 120 or data.heart_rate <= 50:
        add(20, "Maternal heart rate is outside the usual screening range.")

    # A fetal heart-rate baseline outside 110–160 bpm warrants urgent review.
    if data.baby_heart_rate < 110 or data.baby_heart_rate > 160:
        add(50, "Fetal heart rate is outside the 110–160 bpm screening range.")
        urgent = True
        critical_indicator_count += 1

    if measurements["cervical_length_cm"] < 2.5:
        # A short cervix needs timely obstetric review even if no other
        # concerning value is present, so place this single finding in the
        # Medium band rather than leaving it in Low.
        add(30, "Short cervical length needs obstetric review.")

    # Background risk factors modify follow-up needs; they do not alone create
    # an emergency result.
    if data.age >= 40:
        add(10, "Maternal age is 40 or above.")
    elif data.age >= 35:
        add(5, "Maternal age is 35 or above.")
    if data.bmi >= 40:
        add(10, "BMI is in the highest obesity category.")
    elif data.bmi >= 30:
        add(5, "BMI is 30 or above.")
    if data.previous_complications:
        add(10, "Previous pregnancy complications were reported.")
    if data.preexisting_diabetes:
        add(20, "Pre-existing diabetes was reported.")
    if data.gestational_diabetes:
        add(15, "Gestational diabetes was reported.")
    if data.baby_count > 1:
        add(10, "Multiple pregnancy was reported.")

    # Mild symptoms stay Low when vital signs are normal.  Serious warning
    # symptoms get urgent escalation rather than being treated as minor points.
    symptom_scores = {
        "headache": 4, "nausea": 2, "vomiting": 5, "swelling": 8,
        "blurred vision": 20, "abdominal pain": 10, "dizziness": 5,
        "fever": 10, "fatigue": 2, "back pain": 4,
    }
    selected_symptom_flags = {
        "headache": data.headache, "nausea": data.nausea,
        "vomiting": data.vomiting, "swelling": data.swelling,
        "blurred vision": data.blurred_vision,
        "abdominal pain": data.abdominal_pain,
    }
    for symptom, selected in selected_symptom_flags.items():
        if selected:
            add(symptom_scores[symptom], f"Reported symptom: {symptom}.")
    for symptom in ("dizziness", "fever", "fatigue", "back pain"):
        if symptom in reported_symptoms:
            add(symptom_scores[symptom], f"Reported symptom: {symptom}.")

    if data.bleeding:
        add(65, "Vaginal bleeding was reported.")
        urgent = True
        critical_indicator_count += 1
    if data.reduced_baby_movement:
        add(65, "Reduced fetal movement was reported.")
        urgent = True
        critical_indicator_count += 1
    if "chest pain" in reported_symptoms:
        add(35, "Chest pain was reported.")

    # Raised BP plus headache/visual symptoms/upper abdominal pain is a
    # pre-eclampsia warning pattern and needs urgent evaluation.
    preeclampsia_symptom = bool(data.headache or data.blurred_vision or data.abdominal_pain)
    if (data.systolic_bp >= 140 or data.diastolic_bp >= 90) and preeclampsia_symptom:
        urgent = True
        clinical_reasons.append("Raised blood pressure with pre-eclampsia warning symptoms.")

    risk_score = min(risk_score, 100)
    if urgent:
        risk_level = "High"
        risk_score = max(risk_score, 70)
        # Do not turn one serious finding plus minor symptoms into a 100% result.
        # Reserve 100% for multiple independent critical indicators.
        if critical_indicator_count <= 1:
            risk_score = min(risk_score, 85)
    elif risk_score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # The persisted/displayed risk class is the actual trained-model class.
    # Rule-based screening stays separate and supplies additional reasons.
    result["screening_risk_level"] = risk_level
    result["risk_score"] = int(risk_score)
    risk_level = result["risk_level"]


    # ==========================================
    # Recommendations
    # ==========================================

    symptom_reasons = []
    symptom_messages = {
        "headache": "Headache was reported and has been included in the assessment.",
        "nausea": "Nausea was reported and has been included in the assessment.",
        "vomiting": "Vomiting was reported and has been included in the assessment.",
        "swelling": "Swelling was reported and has been included in the assessment.",
        "blurred vision": "Blurred vision was reported and needs clinical review.",
        "bleeding": "Bleeding was reported; contact a clinician promptly.",
        "abdominal pain": "Abdominal pain was reported and has been included in the assessment.",
        "reduced baby movement": "Reduced baby movement was reported; seek same-day advice.",
        "chest pain": "Chest pain was reported and needs prompt clinical review.",
        "dizziness": "Dizziness was reported and has been included in the assessment.",
        "fever": "Fever was reported and has been included in the assessment.",
        "fatigue": "Fatigue was reported and has been included in the assessment.",
        "back pain": "Back pain was reported and has been included in the assessment.",
    }
    selected_symptoms = {
        "headache": data.headache,
        "nausea": data.nausea,
        "vomiting": data.vomiting,
        "swelling": data.swelling,
        "blurred vision": data.blurred_vision,
        "bleeding": data.bleeding,
        "abdominal pain": data.abdominal_pain,
        "reduced baby movement": data.reduced_baby_movement,
    }
    for symptom, selected in selected_symptoms.items():
        if selected:
            symptom_reasons.append(symptom_messages[symptom])
    for symptom in ("chest pain", "dizziness", "fever", "fatigue", "back pain"):
        if symptom in reported_symptoms:
            symptom_reasons.append(symptom_messages[symptom])

    if risk_level == "High":

        result["recommendation"] = (
            "Immediate hospital consultation is recommended. "
            "Please contact your healthcare provider immediately."
        )

        result["reasons"] = clinical_reasons + symptom_reasons + [
            "Multiple high-risk maternal indicators detected.",
            "Close medical supervision is required."
        ]


    elif risk_level == "Medium":

        result["recommendation"] = (
            "Regular monitoring and doctor follow-up "
            "is recommended."
        )

        result["reasons"] = clinical_reasons + symptom_reasons + [
            "Moderate pregnancy risk detected.",
            "Regular prenatal monitoring is advised."
        ]


    else:

        result["recommendation"] = (
            "Continue regular prenatal care, maintain a balanced diet, "
            "stay hydrated and attend scheduled check-ups."
        )

        result["reasons"] = clinical_reasons + symptom_reasons or ["Overall pregnancy condition appears stable."]

    return result
