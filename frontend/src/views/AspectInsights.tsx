import React from 'react';
import {
  PieChart,
  Wifi,
  Sparkles,
  Award,
  Clock,
  MapPin,
  Utensils,
  Bed,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

export const AspectInsights: React.FC = () => {
  const radarData = [
    { aspect: 'Cleanliness', score: 88, fullMark: 100 },
    { aspect: 'Staff Service', score: 92, fullMark: 100 },
    { aspect: 'Wi-Fi & Amenities', score: 62, fullMark: 100 },
    { aspect: 'Location', score: 95, fullMark: 100 },
    { aspect: 'Dining', score: 78, fullMark: 100 },
  ];

  const aspectCategories = [
    { name: 'Cleanliness', positive: 78, neutral: 12, negative: 10 },
    { name: 'Staff Service', positive: 82, neutral: 10, negative: 8 },
    { name: 'Wi-Fi & Amenities', positive: 58, neutral: 22, negative: 20 },
    { name: 'Location', positive: 91, neutral: 6, negative: 3 },
    { name: 'Dining', positive: 74, neutral: 16, negative: 10 },
  ];

  const complaintKeywords = [
    { text: 'slow wifi', count: 48, intensity: 'high' },
    { text: 'room service wait', count: 34, intensity: 'medium' },
    { text: 'AC noise', count: 62, intensity: 'high' },
    { text: 'breakfast queue', count: 29, intensity: 'medium' },
    { text: 'elevator delay', count: 41, intensity: 'high' },
    { text: 'pricey parking', count: 21, intensity: 'low' },
    { text: 'shower pressure', count: 18, intensity: 'low' },
    { text: 'keycard error', count: 15, intensity: 'low' },
  ];

  return (
    <div className="space-y-6">
      {/* 2-Column Row 1: Radar Chart + AI Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-borderLight shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderLight mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Aspect Performance Overview
              </h3>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                Multi-Aspect Extraction
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Holistic radar representation across core hotel operational touchpoints.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="aspect" stroke="#475569" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={10} />
                  <Radar
                    name="Performance Score"
                    dataKey="score"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    formatter={(val) => [`${val} / 100`, 'Score']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-borderLight flex items-center justify-between text-xs text-slate-500">
            <span>Highest: <strong>Location (95/100)</strong></span>
            <span>Needs Attention: <strong className="text-rose-600">Wi-Fi (62/100)</strong></span>
          </div>
        </div>

        {/* AI Actionability & Sentiment Insights (6 cols - Matches Screenshot 4) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-borderLight shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderLight mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                AI Management Action Summary
              </h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                High-priority Actions
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Prescriptive operational recommendations synthesized from low-scoring aspect reviews.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-borderLight flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Address WiFi Connectivity in West Wing
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    18 guest reviews highlighted repeated signal drops and slow bandwidth on floors 3 and 4.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-borderLight flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Recognize Front-Desk Concierge Team
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Staff Service earned a 92% positive sentiment rating with frequent praise for rapid check-ins.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-borderLight flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Investigate Breakfast Buffet Queue Times
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dining sentiment drops between 8:30 AM and 9:45 AM due to wait lines at hot stations.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-borderLight flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Amplify Central Location in Marketing
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Guests praise walkability to metro and historic sites as a primary booking motivator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Row 2: Sentiment by Category Bars + Top Complaint Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Stacked Bars */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-borderLight shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-borderLight mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Sentiment by Category</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Positive
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Neutral
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Negative
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {aspectCategories.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>{cat.name}</span>
                  <span className="font-mono text-slate-500">
                    {cat.positive}% Pos / {cat.neutral}% Neu / {cat.negative}% Neg
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 flex overflow-hidden">
                  <div style={{ width: `${cat.positive}%` }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: `${cat.neutral}%` }} className="bg-amber-400 h-full"></div>
                  <div style={{ width: `${cat.negative}%` }} className="bg-rose-500 h-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Complaint Keywords Cloud */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-borderLight shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-borderLight mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Top Complaint Keywords</h3>
            <span className="text-[10px] font-mono text-slate-400">NLP N-gram Extraction</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            High-frequency negative n-grams extracted from sub-3.0 star traveler reviews.
          </p>

          <div className="flex flex-wrap gap-2">
            {complaintKeywords.map((kw, idx) => {
              const isHigh = kw.intensity === 'high';
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    isHigh
                      ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <span>{kw.text}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      isHigh ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {kw.count}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
