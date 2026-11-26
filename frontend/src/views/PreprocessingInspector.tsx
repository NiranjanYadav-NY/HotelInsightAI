import React, { useState, useEffect } from 'react';
import {
  GitFork,
  ArrowRight,
  Code,
  FileCode,
  Terminal,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PreprocessDebugResponse } from '../types';
import { inspectPreprocessing } from '../services/api';

export const PreprocessingInspector: React.FC = () => {
  const sampleInput =
    "<p>The hotel room was absolutely HORRIBLE and the service was terribly slow! 😡 Worst experience ever... http://hotel-review.com/bad-stay </p>";

  const [inputText, setInputText] = useState(sampleInput);
  const [data, setData] = useState<PreprocessDebugResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runInspect(sampleInput);
  }, []);

  const runInspect = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await inspectPreprocessing(text);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Live Hotel Review Preprocessing Pipeline Inspector
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              NLP PIPELINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time step-by-step text transformation, emoji preservation, and subword vectorization prior to BERT tensor encoding.
          </p>
        </div>

        <button
          onClick={() => runInspect(inputText)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-run Pipeline</span>
        </button>
      </div>

      {/* Interactive Text Input */}
      <div className="bg-white p-4 rounded-xl border border-borderLight shadow-card">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
          Test Input Text (Edit below to observe live stage transformations):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              runInspect(e.target.value);
            }}
            placeholder="Type raw review with HTML, emojis, or URLs..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-borderLight rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-800"
          />
        </div>
      </div>

      {/* 4-Stage Horizontal Pipeline Visualizer */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stage 1: Input */}
          <div className="bg-white rounded-xl border border-borderLight shadow-card p-5 flex flex-col justify-between relative group hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  01 / INPUT
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 hidden lg:block" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Raw Text</h3>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Original raw scraped string containing potential HTML markup, embedded URLs, and noisy casing.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 break-words leading-relaxed min-h-[140px] max-h-[180px] overflow-y-auto">
                {data.stages[0]?.input_text || inputText}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Raw String Length: {inputText.length} chars
            </div>
          </div>

          {/* Stage 2: Cleaning */}
          <div className="bg-white rounded-xl border border-borderLight shadow-card p-5 flex flex-col justify-between relative group hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  02 / CLEANING
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 hidden lg:block" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Regex & Text Cleaning</h3>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                HTML tags, web URLs, and redundant whitespaces stripped via regular expressions.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 break-words leading-relaxed min-h-[140px] max-h-[180px] overflow-y-auto">
                {data.stages[1]?.output_text || data.stages[0]?.output_text}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Sanitized Output
            </div>
          </div>

          {/* Stage 3: Normalization & Emoji */}
          <div className="bg-white rounded-xl border border-borderLight shadow-card p-5 flex flex-col justify-between relative group hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  03 / NORMALIZATION
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 hidden lg:block" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Case Folding & Emoji-to-Text</h3>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                All letters lowercased; Unicode emojis converted to descriptive tokens (e.g. 😡 -&gt; :angry_face:).
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 break-words leading-relaxed min-h-[140px] max-h-[180px] overflow-y-auto">
                {data.stages[2]?.output_text || ''}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Preserved High Valence Emojis
            </div>
          </div>

          {/* Stage 4: BERT Vectorization */}
          <div className="bg-white rounded-xl border border-borderLight shadow-card p-5 flex flex-col justify-between relative group hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  04 / TENSORS
                </span>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">BERT Vectorization</h3>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Subword tokenized with [CLS] and [SEP], returning input IDs, attention masks, and tensors.
              </p>
              <div className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-[11px] font-mono break-all leading-relaxed min-h-[140px] max-h-[180px] overflow-y-auto">
                <div className="text-slate-400 mb-1">Tokens:</div>
                <div className="text-amber-300 mb-2">
                  {JSON.stringify(data.tokens.slice(0, 10))}...
                </div>
                <div className="text-slate-400 mb-1">Input IDs:</div>
                <div className="text-emerald-400">
                  [{data.token_ids.slice(0, 8).join(', ')}, ...]
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-600 font-mono font-semibold">
              Tensor Shape: {data.tensor_shape}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Tensor Inspector Details */}
      {data && (
        <div className="bg-white p-6 rounded-xl border border-borderLight shadow-card">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Full Subword Tokenization & PyTorch Tensor Inspection</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tokens list */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                Subword Tokens ({data.tokens.length} tokens):
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-borderLight flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {data.tokens.map((tok, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                      tok === '[CLS]' || tok === '[SEP]'
                        ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                        : tok.startsWith(':')
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {tok}
                  </span>
                ))}
              </div>
            </div>

            {/* Input IDs & Attention Mask */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                Input IDs Vector (first 32 of 256):
              </span>
              <div className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs max-h-48 overflow-y-auto">
                <p className="text-slate-400 text-[11px] mb-1">// Token IDs (Vocabulary Indices)</p>
                <div className="text-emerald-300 break-all">
                  [{data.token_ids.slice(0, 32).join(', ')}, ...]
                </div>
                <p className="text-slate-400 text-[11px] mt-2 mb-1">// Attention Mask (1 = Attend, 0 = Pad)</p>
                <div className="text-blue-300 break-all">
                  [{data.attention_mask.slice(0, 32).join(', ')}, ...]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
