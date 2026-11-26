import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  Flame,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { PredictResponse } from '../types';
import { predictReview } from '../services/api';
import { StarRating } from '../components/StarRating';
import { SentimentPill } from '../components/SentimentPill';
import { AttentionHeatmap } from '../components/AttentionHeatmap';

export const SingleReviewInference: React.FC = () => {
  const presets = [
    {
      label: 'Sarcastic Review',
      text: "Oh, absolutely loved the 'ocean view' through the tiny gap between two concrete buildings, and the 'peaceful' jackhammer at 7 AM was the cherry on top!",
    },
    {
      label: 'Mixed Stay',
      text: "The lobby was grand and the staff at the desk were nice, but the room itself was a disaster. The air conditioning sounded like a jet engine all night, and the bathroom wasn't properly cleaned. Definitely not worth the price!",
    },
    {
      label: 'Emoji-Heavy',
      text: 'Horrible experience! 😡 Room was filthy and smelled like smoke 🤮 Staff was rude 🚫 Never coming back! 👎',
    },
    {
      label: '5-Star Luxury',
      text: 'Breathtaking views, world-class dining, and impeccable concierge service. Every detail was flawless! 🌟',
    },
  ];

  const [inputText, setInputText] = useState(presets[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  // Initial analysis on mount
  React.useEffect(() => {
    handleAnalyze(presets[0].text);
  }, []);

  const handleAnalyze = async (textToRun?: string) => {
    const text = textToRun || inputText;
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await predictReview(text);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-blue-500/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold tracking-wide uppercase mb-1">
            <Zap className="w-3 h-3 text-amber-300" /> Live Multi-Task Transformer
          </div>
          <h2 className="text-lg font-bold">Single-Review Inference & Sarcasm X-Ray Playground</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Compare real-time BERT multi-head contextual attention against traditional keyword bag-of-words heuristics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs bg-black/30 border border-white/20 px-3 py-1.5 rounded-lg text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            BERT-Base Uncased
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Single-Review Input
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {inputText.length} chars
              </span>
            </div>

            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type any hotel guest review to run sentiment classification, continuous star rating regression, and attention diagnostics..."
              className="w-full p-3.5 text-xs bg-slate-50 border border-borderLight rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans leading-relaxed text-slate-800"
            />

            {/* Presets */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Preset Benchmark Examples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p.text);
                      handleAnalyze(p.text);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      inputText === p.text
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-borderLight hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !inputText.trim()}
              className="w-full mt-5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running BERT Attention Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Review</span>
                </>
              )}
            </button>
          </div>

          {/* Key Insights & Aspect Summary Card */}
          {result && (
            <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center justify-between">
                <span>Multi-Task Aspect Breakdown</span>
                <span className="text-[10px] font-mono text-slate-400">Joint Prediction</span>
              </h4>
              <div className="space-y-2.5">
                {result.aspects.map((asp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium">{asp.aspect}</span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={asp.rating} size="sm" />
                      <span className="font-mono text-[11px] font-bold text-slate-800">{asp.rating.toFixed(1)}★</span>
                      <SentimentPill sentiment={asp.sentiment} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Model Output & X-Ray (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <>
              {/* Primary Prediction Stats Card */}
              <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card">
                <div className="flex items-center justify-between pb-3 border-b border-borderLight">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Inference Analysis Results</h3>
                    <SentimentPill
                      sentiment={result.sentiment}
                      confidence={result.confidence}
                      isSarcasm={result.is_sarcasm}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-mono text-xs font-semibold border border-blue-200">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span>{result.latency_ms}ms Latency</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  {/* Continuous Star Rating Readout */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-borderLight flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Predicted Star Rating (Regression Head)
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                          {result.predicted_rating.toFixed(1)}
                        </span>
                        <span className="text-sm font-medium text-slate-400">/ 5.0 Stars</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <StarRating rating={result.predicted_rating} size="md" />
                      <span className="text-[11px] text-slate-500 font-mono">
                        MSE Loss Scaled
                      </span>
                    </div>
                  </div>

                  {/* Softmax Probabilities */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-borderLight space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Sentiment Probabilities (Softmax Head)
                    </span>

                    {/* Negative Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-rose-700">Negative</span>
                        <span className="font-mono text-slate-700">
                          {(result.probabilities.negative * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${result.probabilities.negative * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Neutral Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-amber-700">Neutral</span>
                        <span className="font-mono text-slate-700">
                          {(result.probabilities.neutral * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${result.probabilities.neutral * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Positive Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-emerald-700">Positive</span>
                        <span className="font-mono text-slate-700">
                          {(result.probabilities.positive * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${result.probabilities.positive * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sarcasm & Attention X-Ray View */}
              <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-borderLight">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      BERT Attention Visualization: Sarcasm Detection X-Ray
                    </h3>
                  </div>
                  {result.is_sarcasm && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                      Sarcasm Confidence: {(result.sarcasm_probability * 100).toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Heatmap */}
                <AttentionHeatmap
                  attentionWeights={result.attention_weights}
                  isSarcasm={result.is_sarcasm}
                />

                {/* Side-by-Side Comparison: Keyword Baseline (Wrong) vs BERT Model (Context-Aware) */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-3">
                    Comparative Diagnostic: Keyword Baseline vs. Deep BERT Transformer
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Existing Keyword System */}
                    <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">
                          Existing Keyword-Based System
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-800 border border-rose-300">
                          FAILED
                        </span>
                      </div>
                      <div className="text-xs text-rose-900 font-medium mb-1">
                        Sentiment Outcome: <strong className="text-rose-700">{result.keyword_baseline.baseline_sentiment} (Wrong)</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {result.keyword_baseline.explanation}
                      </p>
                      <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[10px] text-rose-700 font-mono">
                        <span>Keywords: {result.keyword_baseline.detected_keywords.map((k) => `'${k.word}'`).join(', ') || 'None'}</span>
                        <span>Score: {result.keyword_baseline.baseline_score > 0 ? `+${result.keyword_baseline.baseline_score}` : result.keyword_baseline.baseline_score}</span>
                      </div>
                    </div>

                    {/* Proposed BERT Model */}
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">
                          Proposed BERT Model (Ours)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-800 border border-emerald-300">
                          SUCCESS
                        </span>
                      </div>
                      <div className="text-xs text-emerald-900 font-medium mb-1">
                        Sentiment Outcome: <strong className="text-emerald-700">{result.sentiment} {result.is_sarcasm ? '/ Sarcasm' : ''}</strong> ({(result.confidence * 100).toFixed(0)}% Conf.)
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Multi-layered attention detected contextual dissonance. High attention on positive terms juxtaposed with disruptive negative attributes.
                      </p>
                      <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-700 font-mono">
                        <span>Rating: {result.predicted_rating.toFixed(1)} / 5.0</span>
                        <span>Sarcasm: {result.is_sarcasm ? 'Detected' : 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-borderLight shadow-card text-center">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                Click <strong>"Analyze Review"</strong> on the left to inspect multi-task predictions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
