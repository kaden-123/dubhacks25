"""
Configuration management for the backend application.
Loads environment variables and provides application settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # OpenAI Configuration
    openai_api_key: str = ""

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://localhost:3003,http://localhost:3004"

    # Application Settings
    max_session_duration: int = 3600  # seconds
    frame_processing_fps: int = 10

    # Pose Detection Settings
    mediapipe_model_complexity: int = 1  # 0, 1, or 2 (higher = more accurate but slower)
    mediapipe_min_detection_confidence: float = 0.5
    mediapipe_min_tracking_confidence: float = 0.5

    # Comparison Thresholds
    angle_error_threshold_high: float = 30.0  # degrees - major error
    angle_error_threshold_medium: float = 15.0  # degrees - medium error
    angle_error_threshold_low: float = 5.0  # degrees - minor error

    # LLM Settings
    llm_model: str = "gpt-4o-mini"  # or "gpt-4o" for better quality
    llm_max_tokens: int = 150
    llm_temperature: float = 0.7
    max_feedback_items_per_section: int = 5

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()
