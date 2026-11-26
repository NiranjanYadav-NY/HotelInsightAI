import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  GitFork,
  Network,
  FileSpreadsheet,
  PieChart,
  Settings,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  apiStatus: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, apiStatus }) => {
  const menuItems = [
    { id: 'overview' as ActiveTab, label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'inference' as ActiveTab, label: 'Inference & Sarcasm X-Ray', icon: Sparkles },
    { id: 'preprocessing' as ActiveTab, label: 'Preprocessing Inspector', icon: GitFork },
    { id: 'architecture' as ActiveTab, label: 'Model Architecture & Lab', icon: Network },
    { id: 'batch' as ActiveTab, label: 'Batch CSV Analyzer', icon: FileSpreadsheet },
    { id: 'aspects' as ActiveTab, label: 'Aspect Hospitality Insights', icon: PieChart },
    { id: 'settings' as ActiveTab, label: 'Model Ops & API Config', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1E293B] text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-700/60 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-900/40">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight leading-tight">
              HotelInsight <span className="text-blue-400">AI</span>
            </h1>
            <p className="text-[11px] font-mono text-slate-400">BERT Multi-Task v2.4</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400 px-3 mb-2 font-semibold">
            Intelligence Views
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Model Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Transformer</span>
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              bert-base
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Backend API</span>
            <span className="font-mono text-xs text-blue-300 capitalize">{apiStatus}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>CrossEntropy + MSE Joint Loss</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 mt-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
            NY
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white leading-tight">Niranjan Yadav</p>
            <p className="text-[10px] text-slate-400">ML Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
