import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Copy,
  Check,
  Zap,
  Terminal,
  Activity,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';

export const ModelOpsConfig: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('bert-base-uncased');
  const [sentimentThreshold, setSentimentThreshold] = useState(85);
  const [ratingTolerance, setRatingTolerance] = useState(1.5);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const samplePayload = JSON.stringify(
    {
      text: "The hotel service was absolutely fantastic and the staff went out of their way to help. I wasn't expecting such top-tier hospitality!",
    },
    null,
    2
  );

  const sampleResponse = JSON.stringify(
    {
      sentiment: "Positive",
      confidence: 0.96,
      probabilities: {
        negative: 0.01,
        neutral: 0.03,
        positive: 0.96
      },
      predicted_rating: 4.9,
      latency_ms: 38.0,
      is_sarcasm: false,
      sarcasm_probability: 0.04
    },
    null,
    2
  );

  const copyToClipboard = (text: string, isUrl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUrl) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Model Ops & API Configuration
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active Production Environment
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Transformer backbone selection, dynamic inference confidence thresholds, and live REST API test bench.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all shrink-0">
          Save Configuration
        </button>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Model Settings & Gauges (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Model Selector */}
          <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Active Transformer Model
            </h3>
            <div className="space-y-2.5">
              {[
                { id: 'bert-base-uncased', name: 'bert-base-uncased', size: '438 MB', status: 'Active & Fine-Tuned' },
                { id: 'roberta-base', name: 'roberta-base', size: '498 MB', status: 'Pretrained Ready' },
                { id: 'distilbert-base', name: 'distilbert-base', size: '268 MB', status: 'Fast Inference' },
              ].map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                        : 'bg-slate-50 border-borderLight hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{m.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Model Size: {m.size} • {m.status}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Confidence Thresholds */}
          <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Inference Thresholds & Calibration
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">Sentiment Confidence Threshold</span>
                <span className="font-mono font-bold text-blue-600">{sentimentThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={sentimentThreshold}
                onChange={(e) => setSentimentThreshold(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Predictions below this confidence score are flagged for manual QA review.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">Rating Discrepancy Tolerance (Stars)</span>
                <span className="font-mono font-bold text-blue-600">±{ratingTolerance.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={ratingTolerance}
                onChange={(e) => setRatingTolerance(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Flags potential fake reviews when user star rating diverges from predicted rating.
              </span>
            </div>
          </div>

          {/* Hardware Telemetry Gauges */}
          <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Hardware & Performance Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-borderLight text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Average Latency
                </span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">38ms</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Optimized Torch</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-borderLight text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  VRAM Allocation
                </span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">1.2 GB</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">/ 16.0 GB Shared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live API Playground (7 cols - Matches Screenshot 10) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-borderLight shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderLight mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  API Playground & Integrations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct HTTP endpoint for programmatic hotel review ingestion.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                  REST v1
                </span>
              </div>
            </div>

            {/* Endpoint Bar */}
            <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs flex items-center justify-between text-slate-300 mb-4">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="text-emerald-400 font-bold">POST</span>
                <span className="text-white truncate">http://localhost:8000/api/predict</span>
              </div>
              <button
                onClick={() => copyToClipboard('http://localhost:8000/api/predict', true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors shrink-0"
              >
                {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>

            {/* Request Payload */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Request Payload (JSON)</span>
                <span className="font-mono text-[10px] text-slate-400">Content-Type: application/json</span>
              </div>
              <pre className="p-3 bg-slate-900 rounded-lg text-blue-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {samplePayload}
              </pre>
            </div>

            {/* Live Response */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Response (200 OK)</span>
                <button
                  onClick={() => copyToClipboard(sampleResponse, false)}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800"
                >
                  {copiedJson ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedJson ? 'Copied JSON' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-56 overflow-y-auto">
                {sampleResponse}
              </pre>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-borderLight flex items-center justify-between text-xs text-slate-500">
            <span>FastAPI OpenAPI Documentation: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-blue-600 underline font-mono">/docs</a></span>
            <span className="font-mono text-[11px]">Ready for Production Deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
