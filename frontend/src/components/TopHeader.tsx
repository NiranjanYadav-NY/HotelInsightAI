import React from 'react';
import { Search, Calendar, Bell, ChevronDown } from 'lucide-react';
import { ActiveTab } from '../types';

interface TopHeaderProps {
  activeTab: ActiveTab;
}

const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Executive Overview Dashboard',
    subtitle: 'Real-time AI-based Hotel Review Sentiment & Rating Insights',
  },
  inference: {
    title: 'BERT Attention & Sarcasm X-Ray',
    subtitle: 'Live Single-Review Multi-Task Inference and Context Dissonance Analysis',
  },
  preprocessing: {
    title: 'Data Preprocessing Pipeline Inspector',
    subtitle: 'Live Hotel Review Preprocessing View (Cleaning -> Folding -> Demojize -> Vectorize)',
  },
  architecture: {
    title: 'Multi-Task BERT Model Architecture & Lab',
    subtitle: '12-Layer Transformer Backbone with Shared Encoder, Softmax Classification & MSE Regression',
  },
  batch: {
    title: 'Batch CSV & Dataset Analyzer',
    subtitle: 'Process Large Datasets with Rating Discrepancy Detection (|Actual - Pred| >= 1.5)',
  },
  aspects: {
    title: 'Aspect-Based Hospitality Insights',
    subtitle: 'Multi-dimensional Aspect Performance: Cleanliness, Service, Wi-Fi, Location, Dining',
  },
  settings: {
    title: 'Model Ops & API Configuration',
    subtitle: 'Active Transformer Checkpoint, Hardware Telemetry & Real-Time API Playground',
  },
};

export const TopHeader: React.FC<TopHeaderProps> = ({ activeTab }) => {
  const meta = tabTitles[activeTab] || { title: 'Dashboard', subtitle: '' };

  return (
    <header className="h-20 bg-white border-b border-borderLight px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{meta.title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews, tokens, aspects..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-borderLight rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-borderLight rounded-lg text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-borderLight">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-semibold text-xs flex items-center justify-center">
            NY
          </div>
        </div>
      </div>
    </header>
  );
};
