from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None

    # App settings
    app_name: str = "Squircle API"
    environment: str = "development"
    debug: bool = True

    # CORS
    cors_origins: list = ["*"]  # In production, specify exact origins

    # LLM Settings
    llm_provider: str = "anthropic"  # or "openai"
    llm_model: str = "claude-3-haiku-20240307"  # Fast and cheap for tag extraction
    llm_temperature: float = 0.3
    llm_max_tokens: int = 500

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
