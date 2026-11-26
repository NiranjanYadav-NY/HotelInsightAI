from typing import List, Dict, Optional, Any

try:
    from pydantic import BaseModel, Field
    PYDANTIC_AVAILABLE = True
except ImportError:
    PYDANTIC_AVAILABLE = False
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            res = {}
            for k, v in self.__dict__.items():
                if hasattr(v, 'model_dump'):
                    res[k] = v.model_dump()
                elif isinstance(v, list):
                    res[k] = [item.model_dump() if hasattr(item, 'model_dump') else item for item in v]
                elif isinstance(v, dict):
                    res[k] = {dk: dv.model_dump() if hasattr(dv, 'model_dump') else dv for dk, dv in v.items()}
                else:
                    res[k] = v
            return res
        def dict(self):
            return self.model_dump()
    def Field(default=None, **kwargs):
        return default

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Hotel review text to analyze")

class AttentionWeight(BaseModel):
    token: str
    weight: float = Field(..., ge=0.0, le=1.0)
    sentiment_bias: Optional[str] = None  # "positive", "negative", "neutral"

class KeywordMatch(BaseModel):
    word: str
    score: float
    polarity: str

class KeywordBaselineComparison(BaseModel):
    baseline_sentiment: str
    baseline_score: float
    detected_keywords: List[KeywordMatch]
    verdict: str
    is_sarcasm_detected_by_bert: bool
    explanation: str

class AspectScore(BaseModel):
    aspect: str  # Cleanliness, Staff Service, Wi-Fi & Amenities, Location, Dining
    rating: float = Field(..., ge=1.0, le=5.0)
    sentiment: str  # Positive, Neutral, Negative
    confidence: float
    mentions: List[str]

class PreprocessStageOutput(BaseModel):
    stage_id: str
    stage_name: str
    input_text: str
    output_text: str
    description: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class PreprocessDebugResponse(BaseModel):
    stages: List[PreprocessStageOutput]
    tokens: List[str]
    token_ids: List[int]
    attention_mask: List[int]
    tensor_shape: str

class ClassProbabilities(BaseModel):
    negative: float = Field(..., ge=0.0, le=1.0)
    neutral: float = Field(..., ge=0.0, le=1.0)
    positive: float = Field(..., ge=0.0, le=1.0)

class PredictResponse(BaseModel):
    sentiment: str  # "Positive", "Neutral", "Negative"
    confidence: float = Field(..., ge=0.0, le=1.0)
    probabilities: ClassProbabilities
    predicted_rating: float = Field(..., ge=1.0, le=5.0)
    latency_ms: float
    preprocessing: PreprocessDebugResponse
    attention_weights: List[AttentionWeight]
    keyword_baseline: KeywordBaselineComparison
    aspects: List[AspectScore]
    is_sarcasm: bool
    sarcasm_probability: float

class BatchRowResult(BaseModel):
    id: int
    review_text: str
    actual_rating: Optional[float] = None
    pred_sentiment: str
    pred_rating: float
    confidence: float
    rating_discrepancy: str  # "Yes ⚠️ 1.5+ diff" or "No"
    discrepancy_delta: Optional[float] = None

class BatchPredictResponse(BaseModel):
    total_processed: int
    avg_predicted_rating: float
    sentiment_distribution: Dict[str, int]
    discrepancy_count: int
    discrepancy_percentage: float
    processing_time_ms: float
    rows: List[BatchRowResult]

class ModelBenchmarkItem(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    training_time_seconds: float
    is_active: bool = False

class ConfusionMatrixData(BaseModel):
    labels: List[str]
    matrix: List[List[float]]  # 3x3 percentage grid

class ScatterPoint(BaseModel):
    actual: float
    predicted: float
    sentiment: str
    text_snippet: str

class MetricsResponse(BaseModel):
    models: List[ModelBenchmarkItem]
    confusion_matrix: ConfusionMatrixData
    scatter_data: List[ScatterPoint]
    top_performer: str
    avg_accuracy: float
    mean_squared_error: float

class RecentReviewItem(BaseModel):
    id: str
    user_initials: str
    user_name: str
    user_type: str  # Solo, Family, Business, Couples
    text: str
    actual_rating: float
    predicted_rating: float
    sentiment: str
    timestamp: str
    highlighted_phrases: List[Dict[str, str]]

class DashboardOverviewResponse(BaseModel):
    total_reviews: str
    total_sources: str
    avg_predicted_rating: float
    rating_delta_pct: float
    net_sentiment_score: int
    net_sentiment_delta: int
    bert_accuracy: float
    sentiment_trend_by_month: List[Dict[str, Any]]
    recent_reviews: List[RecentReviewItem]
