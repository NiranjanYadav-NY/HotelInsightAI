import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MessageSquare,
  Star,
  Award,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { DashboardOverviewResponse } from '../types';
import { fetchDashboardOverview } from '../services/api';
import { StarRating } from '../components/StarRating';
import { SentimentPill } from '../components/SentimentPill';

export const ExecutiveOverview: React.FC = () => {
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  useEffect(() => {
    fetchDashboardOverview()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter reviews
  const filteredReviews = data.recent_reviews.filter((rev) => {
    const matchesSearch =
      rev.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment =
      sentimentFilter === 'ALL' || rev.sentiment.toUpperCase() === sentimentFilter.toUpperCase();
    const matchesRating =
      ratingFilter === 'ALL' || Math.floor(rev.actual_rating).toString() === ratingFilter;
    return matchesSearch && matchesSentiment && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Total Reviews</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {data.total_reviews}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>{data.total_sources}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Avg Predicted Rating</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
            {data.avg_predicted_rating} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Up by {data.rating_delta_pct}% vs last month</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Net Sentiment Score</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            +{data.net_sentiment_score}%
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{data.net_sentiment_delta}% positive change</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">BERT Model Accuracy</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {data.bert_accuracy}%
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Joint Fine-Tuning</span>
          </div>
        </div>
      </div>

      {/* Dual-Axis Trend Chart */}
      <div className="bg-white p-6 rounded-xl border border-borderLight shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-borderLight gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Sentiment Trend vs. Average Rating Over Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly sentiment volume distribution (bars) alongside the 1.0–5.0 continuous star rating curve (line).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-[#10B981]"></span> Positive
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-[#F59E0B]"></span> Neutral
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-[#EF4444]"></span> Negative
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
              <span className="w-3 h-0.5 bg-blue-600"></span> Avg Rating (1–5)
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.sentiment_trend_by_month} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#2563EB"
                fontSize={11}
                tickLine={false}
                domain={[1, 5]}
                tickFormatter={(v) => `${v}★`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar yAxisId="left" dataKey="positive" fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={16} />
              <Bar yAxisId="left" dataKey="neutral" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={16} />
              <Bar yAxisId="left" dataKey="negative" fill="#EF4444" radius={[3, 3, 0, 0]} maxBarSize={16} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgRating"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filterable Recent Hotel Reviews Feed */}
      <div className="bg-white rounded-xl border border-borderLight shadow-card overflow-hidden">
        <div className="p-5 border-b border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Hotel Reviews & Sentiment</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live incoming reviews analyzed by the multi-task model with predicted stars and sentiment pills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-borderLight rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sentiment Filter */}
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-borderLight rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive Only</option>
              <option value="NEUTRAL">Neutral Only</option>
              <option value="NEGATIVE">Negative Only</option>
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-borderLight rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-borderLight">
          {filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No reviews match the selected filter criteria.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 mt-0.5">
                    {rev.user_initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{rev.user_name}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                        {rev.user_type}
                      </span>
                      <span className="text-[11px] text-slate-400">• {rev.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{rev.text}</p>
                  </div>
                </div>

                <div className="flex items-center md:flex-col md:items-end justify-between shrink-0 gap-2 pl-12 md:pl-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800">{rev.actual_rating.toFixed(1)}★</span>
                    <StarRating rating={rev.predicted_rating} size="sm" />
                  </div>
                  <SentimentPill
                    sentiment={rev.sentiment}
                    isSarcasm={rev.text.toLowerCase().includes('loved') && rev.text.toLowerCase().includes('jackhammer')}
                    size="sm"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
