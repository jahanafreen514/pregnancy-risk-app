import re


def is_strong_password(password: str) -> bool:
    return len(password) >= 8 and all((re.search(r"[A-Z]", password), re.search(r"[a-z]", password), re.search(r"\d", password), re.search(r"[^\w\s]", password)))