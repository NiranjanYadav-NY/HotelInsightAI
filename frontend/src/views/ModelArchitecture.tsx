import React, { useState, useEffect } from 'react';
import {
  Network,
  Cpu,
  Layers,
  Award,
  TrendingUp,
  Activity,
  CheckCircle,
  FileCode,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  Line,
} from 'recharts';
import { MetricsResponse } from '../types';
import { fetchMetrics } from '../services/api';

export const ModelArchitecture: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics()
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Model comparison bar data
  const barData = metrics.models.map((m) => ({
    name: m.model_name,
    accuracy: Math.round(m.accuracy * 100),
    fill: m.model_name === 'BERT' ? '#2563EB' : '#64748B',
  }));

  return (
    <div className="space-y-6">
      {/* Visual Multi-Task Architecture Flowchart (Matches Screenshot 5) */}
      <div className="bg-white p-6 rounded-xl border border-borderLight shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-borderLight mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Multi-Task BERT Model Architecture Explorer
              </h3>
              <p className="text-xs text-slate-500">
                Shared 12-layer transformer representation driving simultaneous 3-class sentiment & 1-5 continuous star rating.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-500">Backbone: <strong>BERT-base-uncased</strong></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">Loss: <strong>CrossEntropy + MSE</strong></span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
          </div>
        </div>

        {/* Node Diagram */}
        <div className="relative py-8 px-4 bg-slate-50/60 rounded-xl border border-borderLight overflow-x-auto">
          <div className="flex items-center justify-between min-w-[760px] max-w-4xl mx-auto gap-4 relative">
            {/* Node 1: Input Tokenizer */}
            <div className="w-52 p-4 bg-white rounded-xl border border-borderLight shadow-sm text-center relative z-10">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Input Layer
              </span>
              <h4 className="font-bold text-slate-800 text-xs">BERT Tokenizer</h4>
              <p className="text-[10px] text-slate-400 mt-1">Raw Review Text</p>
              <div className="mt-2 text-[10px] font-mono bg-slate-50 py-1 rounded border border-slate-100">
                seq_len = 256
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex-1 h-0.5 bg-blue-300 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-blue-500 rotate-45"></div>
            </div>

            {/* Node 2: BERT Transformer Encoder */}
            <div className="w-64 p-5 bg-white rounded-xl border-2 border-blue-500 shadow-md text-center relative z-10 ring-4 ring-blue-50">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                Encoder Layer
              </span>
              <h4 className="font-bold text-slate-900 text-sm">12-Layer BERT-Base</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                12 Self-Attention Heads (768 Dim)
              </p>
              <div className="mt-2 text-[10px] font-mono bg-blue-50 text-blue-800 py-1 rounded font-semibold">
                Multi-Head Attention Weights
              </div>
            </div>

            {/* Split Connectors */}
            <div className="w-16 relative flex flex-col justify-between h-36">
              <div className="h-0.5 bg-blue-300 w-full relative top-4">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-blue-500 rotate-45"></div>
              </div>
              <div className="h-0.5 bg-blue-300 w-full relative bottom-4">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-blue-500 rotate-45"></div>
              </div>
            </div>

            {/* Node 3 & 4: Two Heads */}
            <div className="space-y-4 w-60">
              {/* Classification Head */}
              <div className="p-4 bg-white rounded-xl border border-emerald-300 shadow-sm relative z-10">
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">
                  Classification Head
                </span>
                <h4 className="font-bold text-slate-800 text-xs">Softmax (3-Class)</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Negative / Neutral / Positive</p>
                <div className="mt-2 text-[10px] font-mono bg-emerald-50 text-emerald-700 py-0.5 px-2 rounded font-semibold inline-block">
                  CrossEntropy Loss
                </div>
              </div>

              {/* Regression Head */}
              <div className="p-4 bg-white rounded-xl border border-amber-300 shadow-sm relative z-10">
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
                  Regression Head
                </span>
                <h4 className="font-bold text-slate-800 text-xs">Linear Layer + Sigmoid Scale</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">1.0 – 5.0 Star Rating Scale</p>
                <div className="mt-2 text-[10px] font-mono bg-amber-50 text-amber-700 py-0.5 px-2 rounded font-semibold inline-block">
                  MSE Loss (Continuous)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmarks & Performance Metrics (Matches Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Accuracy Comparison Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-borderLight shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-sm">Model Accuracy Comparison</h3>
              <span className="text-xs font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                NLP Classification Benchmarks
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Comparing NLP models on sentiment classification across test evaluation set.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Accuracy']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-borderLight">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Top Performer</span>
                <span className="text-base font-extrabold text-blue-700">BERT (85%)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-borderLight flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700 text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. Accuracy</span>
                <span className="text-base font-extrabold text-slate-800">{metrics.avg_accuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3x3 Confusion Matrix (6 cols - Matches Screenshot 1) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-borderLight shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Confusion Matrix</h3>
            <p className="text-xs text-slate-500 mb-4">
              Normalized percentage breakdown of Actual vs. Predicted sentiment classes.
            </p>

            <div className="space-y-3">
              {/* Header Cols: Predicted */}
              <div className="text-center font-bold text-xs text-slate-500 uppercase tracking-wider">
                Predicted Sentiment
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-slate-600">
                <div className="text-[11px] text-slate-400 font-normal">Actual ↓</div>
                <div>Positive</div>
                <div>Neutral</div>
                <div>Negative</div>
              </div>

              {/* Rows */}
              {metrics.confusion_matrix.labels.map((rowLabel, rIdx) => (
                <div key={rIdx} className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-xs font-semibold text-slate-700 text-right pr-2">
                    {rowLabel}
                  </div>
                  {metrics.confusion_matrix.matrix[rIdx].map((val, cIdx) => {
                    // Cell background based on value
                    const isDiagonal = rIdx === cIdx;
                    let cellBg = 'bg-blue-100 text-blue-900';
                    if (val > 30) cellBg = 'bg-blue-600 text-white font-bold';
                    else if (val > 20) cellBg = 'bg-blue-400 text-white font-semibold';
                    else if (val > 15) cellBg = 'bg-blue-200 text-blue-900';

                    return (
                      <div
                        key={cIdx}
                        className={`h-12 rounded-lg flex items-center justify-center font-mono text-xs border border-blue-300/40 shadow-xs transition-transform hover:scale-105 ${cellBg}`}
                      >
                        {val.toFixed(1)}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-borderLight flex items-center justify-between text-xs text-slate-500">
            <span>Diagonal cells indicate correct classification agreement.</span>
            <span className="font-mono text-emerald-600 font-semibold">MSE: {metrics.mean_squared_error}</span>
          </div>
        </div>
      </div>

      {/* Regression Scatter Plot: Actual vs. Predicted Ratings */}
      <div className="bg-white p-6 rounded-xl border border-borderLight shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-borderLight mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Actual vs. Predicted Ratings (Regression Fit)</h3>
            <p className="text-xs text-slate-500">
              Evaluation of the continuous star rating regression head across test hotel reviews.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>R² = 0.88</span>
            <span>•</span>
            <span>RMSE = 0.58 Stars</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                type="number"
                dataKey="actual"
                name="Actual Rating"
                domain={[0, 5]}
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(v) => `${v}★`}
              />
              <YAxis
                type="number"
                dataKey="predicted"
                name="Predicted Rating"
                domain={[0, 5]}
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(v) => `${v}★`}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 rounded-lg border border-borderLight shadow-lg text-xs space-y-1">
                        <div className="font-bold text-slate-900">
                          Actual: {data.actual}★ | Pred: {data.predicted}★
                        </div>
                        <div className="text-slate-500 text-[11px] max-w-xs truncate">
                          "{data.text_snippet}"
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Ratings" data={metrics.scatter_data} fill="#2563EB" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
