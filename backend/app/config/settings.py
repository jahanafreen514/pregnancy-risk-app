from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_url: str
    secret_key: str
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,https://pregnancy-risk-app-olive.vercel.app"
    smtp_host: str | None = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str | None = "glowcare20262gmail.com@gmail.com"
    smtp_password: str | None = "dodt wvcm bjdn sfol"
    smtp_from: str | None = "glowcare20262gmail.com@gmail.com"
    # HTTP email providers work on Render's free tier, where SMTP ports are
    # unavailable.  Resend or Brevo is used when configured.
    resend_api_key: str | None = None
    email_from: str | None = "GlowCare <onboarding@resend.dev>"
    brevo_api_key: str | None = None
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
        return bool(
            self.resend_api_key
            or self.brevo_api_key
            or (self.smtp_host and self.smtp_from)
        )

    @property
    def ice_servers(self) -> list[dict]:
        servers = [{"urls": [url.strip() for url in self.stun_urls.split(",") if url.strip()]}]
        if self.turn_url and self.turn_username and self.turn_credential:
            servers.append({"urls": self.turn_url, "username": self.turn_username, "credential": self.turn_credential})
        return servers


@lru_cache
def get_settings():
    return Settings()
