"""One-time, idempotent migration of legacy SQLite user accounts to MongoDB.

Run from the backend directory after configuring ``.env``:
    python migrate_sqlite_users_to_mongodb.py

The migration preserves existing password hashes, so users keep their current
passwords. It only inserts an account when its normalized email is absent from
MongoDB; it never deletes or overwrites records.
"""

import argparse
import asyncio
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from app.config.db import resolve_atlas_uri
from app.config.settings import get_settings


SQLITE_DATABASE = Path(__file__).with_name("pregnancy_risk.db")


def parse_created_at(value: object) -> datetime:
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            pass
    return datetime.now(timezone.utc)


def legacy_users() -> list[dict]:
    connection = sqlite3.connect(SQLITE_DATABASE)
    connection.row_factory = sqlite3.Row
    try:
        return [dict(row) for row in connection.execute("SELECT * FROM users")]
    finally:
        connection.close()


async def migrate(dry_run: bool) -> tuple[int, int]:
    load_dotenv(Path(__file__).with_name(".env"))
    client = AsyncIOMotorClient(resolve_atlas_uri(get_settings().mongodb_url))
    inserted = 0
    skipped = 0
    try:
        users = client["glowcare"]["users"]
        for legacy_user in legacy_users():
            email = str(legacy_user["email"]).strip().lower()
            if await users.find_one({"email": email}, {"_id": 1}):
                skipped += 1
                continue

            document = {
                "name": legacy_user["name"],
                "email": email,
                "password_hash": legacy_user["password_hash"],
                "role": legacy_user.get("role") or "user",
                "country_code": legacy_user.get("country_code"),
                "phone": legacy_user.get("phone"),
                "selected_doctor": legacy_user.get("selected_doctor"),
                "is_active": bool(legacy_user.get("is_active", True)),
                "is_email_verified": False,
                "created_at": parse_created_at(legacy_user.get("created_at")),
            }
            if not dry_run:
                await users.insert_one(document)
            inserted += 1
        return inserted, skipped
    finally:
        client.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Migrate GlowCare SQLite users to MongoDB.")
    parser.add_argument("--dry-run", action="store_true", help="Report inserts without writing to MongoDB.")
    args = parser.parse_args()
    inserted, skipped = asyncio.run(migrate(args.dry_run))
    action = "would insert" if args.dry_run else "inserted"
    print(f"Migration complete: {action}={inserted}, already present={skipped}")


if __name__ == "__main__":
    main()
