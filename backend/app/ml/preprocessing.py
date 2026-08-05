import pandas as pd

FEATURES = ["bpSystolic", "sugar", "temperature", "heartRate"]


def clean_dataset(source: str, destination: str) -> None:
    data = pd.read_csv(source).dropna(subset=FEATURES + ["risk"])
    data.to_csv(destination, index=False)