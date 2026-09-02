# %% [markdown]
# # GlowCare pregnancy-risk model training demo
# Upload `pregnancy_data_enhanced.csv` to Colab, set `DATASET_PATH`, then run
# each `# %%` section in order. This is one runnable file for demonstration;
# it is not clinical validation or a diagnostic tool.

# %% Install dependencies (uncomment in a fresh Colab runtime)
# !pip -q install xgboost joblib seaborn

# %% Imports and reproducibility
from pathlib import Path
import json
import joblib
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import ConfusionMatrixDisplay, accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

RANDOM_STATE = 42
DATASET_PATH = "/content/pregnancy_data_enhanced.csv"  # change if using Drive
OUTPUT_DIR = Path("/content/glowcare_model_artifacts")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FEATURES = [
    "Age", "Systolic BP", "Diastolic", "BS", "Body Temp", "BMI", "Heart Rate",
    "Previous Complications", "Preexisting Diabetes", "Gestational Diabetes",
    "Mental Health", "Pregnancy Week", "Baby Count", "Baby Weight",
    "Baby Heart Rate", "Cervical Length", "Headache", "Nausea", "Vomiting",
    "Swelling", "Blurred Vision", "Bleeding", "Abdominal Pain",
    "Reduced Baby Movement",
]
TARGET = "Risk Level"

# %% Load and inspect dataset
df = pd.read_csv(DATASET_PATH)
missing = sorted(set(FEATURES + [TARGET]) - set(df.columns))
if missing:
    raise ValueError(f"Dataset is missing required columns: {missing}")
print("Rows, columns:", df.shape)
display(df[FEATURES + [TARGET]].head())
display(df[TARGET].value_counts(dropna=False).rename("count"))

# %% Preprocessing
# Numeric median imputation is explicit and part of the saved pipeline.
X = df[FEATURES].copy()
y_raw = df[TARGET].copy()
valid = y_raw.notna()
X, y_raw = X.loc[valid], y_raw.loc[valid]
numeric_features = X.select_dtypes(include="number").columns.tolist()
non_numeric = sorted(set(FEATURES) - set(numeric_features))
if non_numeric:
    raise ValueError(f"All training features must be numeric; convert first: {non_numeric}")

preprocessor = ColumnTransformer(
    [("numeric", Pipeline([( "imputer", SimpleImputer(strategy="median"))]), numeric_features)],
    remainder="drop",
)
encoder = LabelEncoder()
y = encoder.fit_transform(y_raw)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=RANDOM_STATE, stratify=y
)
print("Train/test:", X_train.shape, X_test.shape)

# %% Model training
model = XGBClassifier(
    n_estimators=300, max_depth=5, learning_rate=0.05, subsample=0.9,
    colsample_bytree=0.9, random_state=RANDOM_STATE, eval_metric="mlogloss", n_jobs=1,
)
pipeline = Pipeline([( "preprocess", preprocessor), ("model", model)])
pipeline.fit(X_train, y_train)

# %% Evaluation and representation
predicted = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, predicted)
print(f"Held-out accuracy: {accuracy:.2%}")
print(classification_report(y_test, predicted, target_names=encoder.classes_))
fig, ax = plt.subplots(figsize=(6, 5))
ConfusionMatrixDisplay.from_predictions(y_test, predicted, display_labels=encoder.classes_, cmap="RdPu", ax=ax)
plt.title("Held-out confusion matrix")
plt.show()

importance = pd.Series(model.feature_importances_, index=FEATURES).sort_values()
importance.plot.barh(figsize=(8, 7), color="#ec4899", title="XGBoost feature importance")
plt.tight_layout(); plt.show()

# %% Export artifacts used by the GlowCare API
# The API currently loads `model.json`, label encoder, and ordered feature list.
model.save_model(str(OUTPUT_DIR / "model.json"))
joblib.dump(encoder, OUTPUT_DIR / "label_encoder.pkl")
joblib.dump(FEATURES, OUTPUT_DIR / "features.pkl")
(OUTPUT_DIR / "model_metadata.json").write_text(json.dumps({
    "algorithm": "XGBoostClassifier", "feature_order": FEATURES,
    "classes": encoder.classes_.tolist(), "held_out_accuracy": round(float(accuracy), 6),
    "test_size": 0.20, "random_state": RANDOM_STATE,
    "note": "Demonstration split metric only; not clinical validation.",
}, indent=2), encoding="utf-8")
print(f"Artifacts exported to: {OUTPUT_DIR}")

# %% Optional: download model artifacts in Colab
# from google.colab import files
# import shutil
# shutil.make_archive("/content/glowcare_model_artifacts", "zip", OUTPUT_DIR)
# files.download("/content/glowcare_model_artifacts.zip")
