"""Train the one XGBoost artifact used by the prediction API.

Run from ``backend`` with ``.venv\\Scripts\\python app\\ml\\train_model.py``.
The feature list is persisted and is the contract used at inference time.
"""
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


BASE_DIR = Path(__file__).resolve().parent
DATASET = BASE_DIR / "dataset" / "pregnancy_data_enhanced.csv"
FEATURES = [
    "Age", "Systolic BP", "Diastolic", "BS", "Body Temp", "BMI", "Heart Rate",
    "Previous Complications", "Preexisting Diabetes", "Gestational Diabetes",
    "Mental Health", "Pregnancy Week", "Baby Count", "Baby Weight",
    "Baby Heart Rate", "Cervical Length", "Headache", "Nausea", "Vomiting",
    "Swelling", "Blurred Vision", "Bleeding", "Abdominal Pain",
    "Reduced Baby Movement",
]
TARGET = "Risk Level"


def main() -> None:
    dataframe = pd.read_csv(DATASET)
    missing_columns = set(FEATURES + [TARGET]) - set(dataframe.columns)
    if missing_columns:
        raise ValueError(f"Dataset is missing required columns: {sorted(missing_columns)}")
    if dataframe[FEATURES + [TARGET]].isna().any().any():
        # Missing values must be resolved at data-preparation time, not silently
        # invented during live clinical prediction.
        raise ValueError("Dataset has missing required values; clean it before training.")

    encoder = LabelEncoder()
    X = dataframe[FEATURES]
    y = encoder.fit_transform(dataframe[TARGET])
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    model = XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
        eval_metric="mlogloss",
        n_jobs=1,
    )
    model.fit(X_train, y_train)
    predicted = model.predict(X_test)
    accuracy = accuracy_score(y_test, predicted)
    print(classification_report(y_test, predicted, target_names=encoder.classes_))
    print(f"Held-out accuracy: {accuracy:.4%}")

    model.save_model(BASE_DIR / "model.json")
    joblib.dump(encoder, BASE_DIR / "label_encoder.pkl")
    joblib.dump(FEATURES, BASE_DIR / "features.pkl")
    (BASE_DIR / "model_metadata.json").write_text(json.dumps({
        "algorithm": "XGBoostClassifier",
        "dataset": DATASET.name,
        "feature_count": len(FEATURES),
        "feature_order": FEATURES,
        "test_size": 0.20,
        "random_state": 42,
        "held_out_accuracy": round(float(accuracy), 6),
        "classes": encoder.classes_.tolist(),
        "note": "Dataset-split accuracy only; not clinical validation accuracy.",
    }, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
