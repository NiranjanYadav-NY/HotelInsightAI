import React, { useState } from 'react';
import { AttentionWeight } from '../types';

interface AttentionHeatmapProps {
  attentionWeights: AttentionWeight[];
  isSarcasm?: boolean;
}

export const AttentionHeatmap: React.FC<AttentionHeatmapProps> = ({
  attentionWeights,
  isSarcasm = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!attentionWeights || attentionWeights.length === 0) {
    return <div className="text-xs text-slate-400 italic">No token attention data available.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Interactive Token Flow */}
      <div className="p-4 bg-slate-50/70 rounded-xl border border-borderLight min-h-[140px] flex flex-wrap gap-2 items-center leading-relaxed">
        {attentionWeights.map((item, idx) => {
          const w = item.weight;
          const isHigh = w >= 0.70;
          const isMed = w >= 0.40 && w < 0.70;
          const isHovered = hoveredIdx === idx;

          // Compute color styling based on sentiment bias and intensity
          let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
          if (item.sentiment_bias === 'negative' || (isSarcasm && isHigh)) {
            if (isHigh) {
              bgClass = 'bg-rose-500 text-white font-semibold shadow-xs border-rose-600';
            } else if (isMed) {
              bgClass = 'bg-rose-100 text-rose-800 border-rose-300 font-medium';
            }
          } else if (item.sentiment_bias === 'positive') {
            if (isHigh) {
              bgClass = 'bg-emerald-500 text-white font-semibold shadow-xs border-emerald-600';
            } else if (isMed) {
              bgClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium';
            }
          } else if (isHigh) {
            bgClass = 'bg-amber-400 text-slate-900 font-semibold border-amber-500';
          }

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative inline-block group"
            >
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs border transition-all duration-150 cursor-pointer ${bgClass} ${
                  isHovered ? 'ring-2 ring-blue-500 ring-offset-1 scale-105 z-10' : ''
                }`}
              >
                {item.token}
              </span>

              {/* Tooltip on Hover or High Attention */}
              {(isHovered || isHigh) && (
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-tight pointer-events-none transition-all shadow-md z-30 whitespace-nowrap ${
                    isHovered
                      ? 'bg-slate-900 text-white opacity-100'
                      : 'bg-slate-800/90 text-slate-200 opacity-90'
                  }`}
                >
                  α = {w.toFixed(2)}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-borderLight px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 border border-rose-600 inline-block"></span>
            <span>High Negative / Sarcastic Attention (α ≥ 0.70)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600 inline-block"></span>
            <span>High Positive Attention</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block"></span>
            <span>Syntactic / Background Tokens</span>
          </div>
        </div>
        <div className="font-mono text-slate-400">
          BERT Layer 12 Multi-Head Attention Pooled
        </div>
      </div>
    </div>
  );
};
