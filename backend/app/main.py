import io
import pandas as pd
from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from app.config import settings
from app.schemas import (
    PredictRequest,
    PredictResponse,
    PreprocessDebugResponse,
    BatchPredictResponse,
    MetricsResponse,
    DashboardOverviewResponse
)
from app.service import service
from app.preprocessing import preprocess_pipeline_inspect

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-Grade Multi-Task BERT Engine for Hotel Review Sentiment & Star Rating Prediction."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "device": service.engine.device,
        "pytorch_active": service.engine.is_pytorch_active,
        "version": settings.APP_VERSION
    }

@app.post("/api/predict", response_model=PredictResponse)
def predict_sentiment_and_rating(req: PredictRequest):
    """
    Accepts review text, runs through the 4-Stage Preprocessing Pipeline,
    executes Multi-Task BERT inference (Classification + Rating Regression),
    extracts token-level attention scores, and contrasts with legacy keyword baseline.
    """
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Review text cannot be empty.")
    try:
        return service.predict_single(req.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.get("/api/preprocess-debug", response_model=PreprocessDebugResponse)
def inspect_preprocessing_stages(
    text: str = Query(
        ...,
        description="Hotel review text to inspect across 01 Clean -> 02 Fold -> 03 Demojize -> 04 Vectorize"
    )
):
    """
    Returns step-by-step intermediate transformations of all 4 preprocessing stages
    with input IDs, attention mask, and token metadata.
    """
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")
    return preprocess_pipeline_inspect(text)

@app.post("/api/predict-batch", response_model=BatchPredictResponse)
async def predict_batch_csv(file: UploadFile = File(...)):
    """
    Upload a CSV file containing hotel reviews.
    Processes rows, appends predicted sentiment, predicted rating (1.0-5.0),
    and identifies rating discrepancies (|actual - predicted| >= 1.5).
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to parse CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded CSV file is empty.")

    return service.process_batch_dataframe(df)

@app.get("/api/export-sample-csv")
def download_sample_csv():
    """Generates and serves a formatted sample CSV file for testing batch analysis."""
    sample_path = settings.DATA_DIR / "sample_reviews.csv"
    if sample_path.exists():
        with open(sample_path, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        content = (
            "review_text,actual_rating\n"
            '"The service was wonderful and staff was polite.",5.0\n'
            '"Oh, absolutely loved the ocean view through the tiny gap between buildings!",1.0\n'
            '"Terrible experience! 😡 Filthy room and noisy AC.",1.0\n'
        )
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=hotel_reviews_sample.csv"}
    )

@app.get("/api/metrics", response_model=MetricsResponse)
def get_benchmarks_and_metrics():
    """
    Returns model benchmark accuracy comparison (BERT 85% vs Random Forest 78% vs LSTM 75%),
    3x3 Confusion Matrix, and regression scatter plot points.
    """
    return service.get_metrics()

@app.get("/api/dashboard-overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview():
    """
    Returns Executive Overview KPIs, sentiment trend bars with rating line,
    and recent verified traveler reviews.
    """
    return service.get_dashboard_overview()
