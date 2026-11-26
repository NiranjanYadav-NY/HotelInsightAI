import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "HotelInsight AI - Sentiment & Rating Engine"
    APP_VERSION: str = "2.4.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Model parameters
    MODEL_NAME: str = "bert-base-uncased"
    MAX_SEQUENCE_LENGTH: int = 256
    DROPOUT_RATE: float = 0.3
    NUM_CLASSES: int = 3  # 0: Negative, 1: Neutral, 2: Positive
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    MODEL_WEIGHTS_DIR: Path = BASE_DIR / "weights"
    DATA_DIR: Path = Path(__file__).resolve().parent / "data"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ]

    class Config:
        env_file = ".env"

settings = Settings()
