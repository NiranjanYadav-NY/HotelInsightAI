import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.preprocessing import preprocess_pipeline_inspect
from app.service import service

def run_tests():
    print("==================================================")
    print("Running Hotel Review AI Engine Self-Test Suite")
    print("==================================================")

    # Test 1: 4-Stage Preprocessing Pipeline
    raw_sample = "<p>The hotel room was absolutely HORRIBLE and the service was terribly slow! 😡 Worst experience ever... http://hotel-review.com/bad-stay </p>"
    print("\n[Test 1] Inspecting 4-Stage Preprocessing Pipeline:")
    res = preprocess_pipeline_inspect(raw_sample)
    for stg in res.stages:
        print(f"  Stage {stg.stage_id}: {stg.stage_name}")
        print(f"    Input:  {stg.input_text[:60]}...")
        print(f"    Output: {stg.output_text[:60]}...")
    assert len(res.stages) == 4, "Must have exactly 4 stages"
    assert len(res.tokens) > 0, "Tokens must not be empty"
    print("  [✓] 4-Stage Preprocessing verified!")

    # Test 2: Sarcastic Review Detection & Attention X-Ray
    sarcasm_sample = "Oh, absolutely loved the 'ocean view' through the tiny gap between two concrete buildings, and the 'peaceful' jackhammer at 7 AM was the cherry on top!"
    print("\n[Test 2] Sarcasm & Attention X-Ray:")
    pred = service.predict_single(sarcasm_sample)
    print(f"  Sentiment: {pred.sentiment} (Confidence: {pred.confidence})")
    print(f"  Predicted Rating: {pred.predicted_rating} / 5.0")
    print(f"  Is Sarcasm: {pred.is_sarcasm} (Sarcasm Prob: {pred.sarcasm_probability})")
    print(f"  Keyword Baseline Verdict: {pred.keyword_baseline.verdict}")
    print(f"  Keyword Baseline Sentiment: {pred.keyword_baseline.baseline_sentiment}")
    assert pred.sentiment == "Negative", "Sarcastic review should be predicted as Negative"
    assert pred.is_sarcasm is True, "Sarcasm flag should be True"
    assert pred.keyword_baseline.baseline_sentiment == "Positive", "Keyword baseline should be fooled into Positive"
    print("  [✓] Sarcasm handling & Baseline contrast verified!")

    # Test 3: Benchmark Metrics
    print("\n[Test 3] Model Benchmark Metrics:")
    metrics = service.get_metrics()
    print(f"  Top Performer: {metrics.top_performer} ({metrics.models[0].model_name}: {metrics.models[0].accuracy*100}%)")
    print(f"  Confusion Matrix shape: {len(metrics.confusion_matrix.matrix)}x{len(metrics.confusion_matrix.matrix[0])}")
    assert len(metrics.models) == 3, "Should have 3 models in benchmark"
    print("  [✓] Metrics data verified!")

    print("\n==================================================")
    print("ALL TESTS PASSED SUCCESSFULLY! BACKEND READY.")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
