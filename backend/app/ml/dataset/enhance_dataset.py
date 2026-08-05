import pandas as pd
import numpy as np

# Load original dataset
df = pd.read_csv("app/ml/dataset/pregnancy_data.csv")

# Rename columns if needed
df = df.rename(columns={
    "SystolicBP": "Systolic BP",
    "DiastolicBP": "Diastolic",
    "BodyTemp": "Body Temp",
    "HeartRate": "Heart Rate",
    "RiskLevel": "Risk Level"
})

# Standardize labels
df["Risk Level"] = df["Risk Level"].replace({
    "low risk": "Low",
    "mid risk": "Medium",
    "high risk": "High"
})

np.random.seed(42)

# Existing generated columns
bmi = []
prev = []
pre = []
gest = []
mental = []

# New pregnancy columns
pregnancy_week = []
baby_count = []
baby_weight = []
baby_heart_rate = []
cervical_length = []

headache = []
nausea = []
vomiting = []
swelling = []
blurred_vision = []
bleeding = []
abdominal_pain = []
reduced_baby_movement = []

for _, row in df.iterrows():

    risk = row["Risk Level"]

    # ----------------------------
    # LOW RISK
    # ----------------------------
    if risk == "Low":

        bmi.append(np.random.randint(18, 25))
        prev.append(0)
        pre.append(0)
        gest.append(0)
        mental.append(0)

        week = np.random.randint(8, 40)
        pregnancy_week.append(week)

        baby_count.append(1)

        baby_weight.append(max(5, week * 90 + np.random.randint(-100, 100)))

        baby_heart_rate.append(np.random.randint(125, 155))

        cervical_length.append(round(np.random.uniform(3.2, 5.0), 1))

        headache.append(np.random.choice([0,1], p=[0.9,0.1]))
        nausea.append(np.random.choice([0,1], p=[0.7,0.3]))
        vomiting.append(np.random.choice([0,1], p=[0.9,0.1]))
        swelling.append(0)
        blurred_vision.append(0)
        bleeding.append(0)
        abdominal_pain.append(np.random.choice([0,1], p=[0.9,0.1]))
        reduced_baby_movement.append(0)

    # ----------------------------
    # MEDIUM RISK
    # ----------------------------
    elif risk == "Medium":

        bmi.append(np.random.randint(24, 30))
        prev.append(np.random.choice([0,1], p=[0.6,0.4]))
        pre.append(np.random.choice([0,1], p=[0.7,0.3]))
        gest.append(np.random.choice([0,1], p=[0.6,0.4]))
        mental.append(np.random.choice([0,1], p=[0.6,0.4]))

        week = np.random.randint(10, 38)
        pregnancy_week.append(week)

        baby_count.append(np.random.choice([1,2], p=[0.96,0.04]))

        baby_weight.append(max(5, week * 85 + np.random.randint(-200, 200)))

        baby_heart_rate.append(np.random.randint(118,160))

        cervical_length.append(round(np.random.uniform(2.8,4.2),1))

        headache.append(np.random.choice([0,1], p=[0.5,0.5]))
        nausea.append(np.random.choice([0,1], p=[0.5,0.5]))
        vomiting.append(np.random.choice([0,1], p=[0.6,0.4]))
        swelling.append(np.random.choice([0,1], p=[0.6,0.4]))
        blurred_vision.append(np.random.choice([0,1], p=[0.8,0.2]))
        bleeding.append(np.random.choice([0,1], p=[0.9,0.1]))
        abdominal_pain.append(np.random.choice([0,1], p=[0.5,0.5]))
        reduced_baby_movement.append(np.random.choice([0,1], p=[0.8,0.2]))

    # ----------------------------
    # HIGH RISK
    # ----------------------------
    else:

        bmi.append(np.random.randint(30,38))
        prev.append(1)
        pre.append(1 if row["BS"] > 140 else 0)
        gest.append(1)
        mental.append(1)

        week = np.random.randint(12,40)
        pregnancy_week.append(week)

        baby_count.append(np.random.choice([1,2], p=[0.9,0.1]))

        baby_weight.append(max(5, week * 75 + np.random.randint(-300,300)))

        baby_heart_rate.append(np.random.choice(
            list(range(90,110)) + list(range(161,181))
        ))

        cervical_length.append(round(np.random.uniform(1.8,3.0),1))

        headache.append(1)
        nausea.append(np.random.choice([0,1], p=[0.3,0.7]))
        vomiting.append(np.random.choice([0,1], p=[0.4,0.6]))
        swelling.append(1)
        blurred_vision.append(1)
        bleeding.append(np.random.choice([0,1], p=[0.3,0.7]))
        abdominal_pain.append(1)
        reduced_baby_movement.append(1)

# Existing columns
df["BMI"] = bmi
df["Previous Complications"] = prev
df["Preexisting Diabetes"] = pre
df["Gestational Diabetes"] = gest
df["Mental Health"] = mental

# New columns
df["Pregnancy Week"] = pregnancy_week
df["Baby Count"] = baby_count
df["Baby Weight"] = baby_weight
df["Baby Heart Rate"] = baby_heart_rate
df["Cervical Length"] = cervical_length

df["Headache"] = headache
df["Nausea"] = nausea
df["Vomiting"] = vomiting
df["Swelling"] = swelling
df["Blurred Vision"] = blurred_vision
df["Bleeding"] = bleeding
df["Abdominal Pain"] = abdominal_pain
df["Reduced Baby Movement"] = reduced_baby_movement

# Save
df.to_csv(
    "app/ml/dataset/pregnancy_data_enhanced.csv",
    index=False
)

print(df.head())
print()
print(df.columns)
print()
print(df["Risk Level"].value_counts())
print("\nUpdated dataset created successfully.")