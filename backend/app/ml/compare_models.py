import os
import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.metrics import accuracy_score

from sklearn.linear_model import LogisticRegression

from sklearn.tree import DecisionTreeClassifier

from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier

from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

csv_file = os.path.join(
    BASE_DIR,
    "dataset",
    "pregnancy_data_enhanced.csv"
)

df = pd.read_csv(csv_file)

df = df.fillna(df.mean(numeric_only=True))
df = df.dropna()

X = df[
[
"Age",
"Systolic BP",
"Diastolic",
"BS",
"Body Temp",
"BMI",
"Previous Complications",
"Preexisting Diabetes",
"Gestational Diabetes",
"Mental Health",
"Heart Rate"
]
]

y = encoder.fit_transform(df["Risk Level"])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

models = {

"Logistic Regression":
LogisticRegression(max_iter=1000),

"Decision Tree":
DecisionTreeClassifier(),

"Random Forest":
RandomForestClassifier(),

"XGBoost":
XGBClassifier(eval_metric="mlogloss")

}

print("\nAccuracy Comparison\n")

for name, model in models.items():

    model.fit(X_train, y_train)

    pred = model.predict(X_test)

    acc = accuracy_score(y_test, pred)

    print(f"{name:25} : {acc:.4f}")
