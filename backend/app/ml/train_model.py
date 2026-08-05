import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load updated dataset
csv_file = os.path.join(
    BASE_DIR,
    "dataset",
    "pregnancy_data_enhanced.csv"
)

df = pd.read_csv(csv_file)
print(df.columns.tolist())
print(df.head())

# Handle missing values
df = df.fillna(df.mean(numeric_only=True))
df = df.dropna()

# Feature columns
X = df[[
    "Age",
    "Systolic BP",
    "Diastolic",
    "BS",
    "Body Temp",
    "BMI",
    "Heart Rate",
    "Previous Complications",
    "Preexisting Diabetes",
    "Gestational Diabetes",
    "Mental Health",
    "Pregnancy Week",
    "Baby Count",
    "Baby Weight",
    "Baby Heart Rate",
    "Cervical Length",
    "Headache",
    "Nausea",
    "Vomiting",
    "Swelling",
    "Blurred Vision",
    "Bleeding",
    "Abdominal Pain",
    "Reduced Baby Movement"
]]

# Target
encoder = LabelEncoder()
y = encoder.fit_transform(df["Risk Level"])

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train Model
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    max_depth=12
)

model.fit(X_train, y_train)

# Prediction
pred = model.predict(X_test)

print("\nClassification Report:\n")
print(
    classification_report(
        y_test,
        pred,
        target_names=encoder.classes_
    )
)

print("Accuracy:", accuracy_score(y_test, pred))

# Save model
joblib.dump(model, os.path.join(BASE_DIR, "model.pkl"))
joblib.dump(encoder, os.path.join(BASE_DIR, "label_encoder.pkl"))

print("\nModel Saved Successfully")