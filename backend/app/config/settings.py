from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_url: str
    secret_key: str
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from: str | None = None
    frontend_url: str | None = None
    backend_url: str | None = None
    stun_urls: str = "stun:stun.l.google.com:19302"
    turn_url: str | None = None
    turn_username: str | None = None
    turn_credential: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    @property
    def cors_origin_list(self):
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
        ]

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host and self.smtp_from)

    @property
    def ice_servers(self) -> list[dict]:
        servers = [{"urls": [url.strip() for url in self.stun_urls.split(",") if url.strip()]}]
        if self.turn_url and self.turn_username and self.turn_credential:
            servers.append({"urls": self.turn_url, "username": self.turn_username, "credential": self.turn_credential})
        return servers


@lru_cache
def get_settings():
    return Settings()
