import React from 'react';
import { Smile, Meh, Frown, Sparkles } from 'lucide-react';

interface SentimentPillProps {
  sentiment: string;
  confidence?: number;
  isSarcasm?: boolean;
  size?: 'sm' | 'md';
}

export const SentimentPill: React.FC<SentimentPillProps> = ({
  sentiment,
  confidence,
  isSarcasm = false,
  size = 'md',
}) => {
  const norm = sentiment?.toLowerCase() || 'neutral';

  let config = {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Smile,
    label: 'Positive',
  };

  if (norm === 'negative') {
    config = {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Frown,
      label: 'Negative',
    };
  } else if (norm === 'neutral') {
    config = {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Meh,
      label: 'Neutral',
    };
  }

  const Icon = config.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs ${config.bg} ${padding}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
      {isSarcasm && (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded-full border border-rose-300">
          <Sparkles className="w-2.5 h-2.5" /> Sarcasm
        </span>
      )}
      {confidence !== undefined && (
        <span className="font-mono text-[10px] opacity-80">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
};
