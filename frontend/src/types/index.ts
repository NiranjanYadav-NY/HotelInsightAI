export interface ClassProbabilities {
  negative: number;
  neutral: number;
  positive: number;
}

export interface AttentionWeight {
  token: string;
  weight: number;
  sentiment_bias?: 'positive' | 'negative' | 'neutral';
}

export interface KeywordMatch {
  word: string;
  score: number;
  polarity: string;
}

export interface KeywordBaselineComparison {
  baseline_sentiment: string;
  baseline_score: number;
  detected_keywords: KeywordMatch[];
  verdict: string;
  is_sarcasm_detected_by_bert: boolean;
  explanation: string;
}

export interface AspectScore {
  aspect: string;
  rating: number;
  sentiment: string;
  confidence: number;
  mentions: string[];
}

export interface PreprocessStageOutput {
  stage_id: string;
  stage_name: string;
  input_text: string;
  output_text: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PreprocessDebugResponse {
  stages: PreprocessStageOutput[];
  tokens: string[];
  token_ids: number[];
  attention_mask: number[];
  tensor_shape: string;
}

export interface PredictResponse {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  probabilities: ClassProbabilities;
  predicted_rating: number;
  latency_ms: number;
  preprocessing: PreprocessDebugResponse;
  attention_weights: AttentionWeight[];
  keyword_baseline: KeywordBaselineComparison;
  aspects: AspectScore[];
  is_sarcasm: boolean;
  sarcasm_probability: number;
}

export interface BatchRowResult {
  id: number;
  review_text: string;
  actual_rating?: number;
  pred_sentiment: string;
  pred_rating: number;
  confidence: number;
  rating_discrepancy: string;
  discrepancy_delta?: number;
}

export interface BatchPredictResponse {
  total_processed: number;
  avg_predicted_rating: number;
  sentiment_distribution: Record<string, number>;
  discrepancy_count: number;
  discrepancy_percentage: number;
  processing_time_ms: number;
  rows: BatchRowResult[];
}

export interface ModelBenchmarkItem {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  training_time_seconds: number;
  is_active: boolean;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][];
}

export interface ScatterPoint {
  actual: number;
  predicted: number;
  sentiment: string;
  text_snippet: string;
}

export interface MetricsResponse {
  models: ModelBenchmarkItem[];
  confusion_matrix: ConfusionMatrixData;
  scatter_data: ScatterPoint[];
  top_performer: string;
  avg_accuracy: number;
  mean_squared_error: number;
}

export interface RecentReviewItem {
  id: string;
  user_initials: string;
  user_name: string;
  user_type: string;
  text: string;
  actual_rating: number;
  predicted_rating: number;
  sentiment: string;
  timestamp: string;
  highlighted_phrases: Array<{ phrase: string; type: string }>;
}

export interface DashboardOverviewResponse {
  total_reviews: string;
  total_sources: string;
  avg_predicted_rating: number;
  rating_delta_pct: number;
  net_sentiment_score: number;
  net_sentiment_delta: number;
  bert_accuracy: number;
  sentiment_trend_by_month: Array<{
    month: string;
    positive: number;
    neutral: number;
    negative: number;
    avgRating: number;
  }>;
  recent_reviews: RecentReviewItem[];
}

export type ActiveTab =
  | 'overview'
  | 'inference'
  | 'preprocessing'
  | 'architecture'
  | 'batch'
  | 'aspects'
  | 'settings';
