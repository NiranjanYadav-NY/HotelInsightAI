import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { BatchPredictResponse, BatchRowResult } from '../types';
import { predictBatchCsv } from '../services/api';
import { SentimentPill } from '../components/SentimentPill';
import { StarRating } from '../components/StarRating';

export const BatchCsvAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BatchPredictResponse | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [discrepancyOnly, setDiscrepancyOnly] = useState(false);

  // Load initial demo preview
  React.useEffect(() => {
    // Generate initial sample data for immediate visual inspection
    const sampleRows: BatchRowResult[] = [
      {
        id: 1,
        review_text: 'The room was spacious and clean, but service was slow, and local amenities were lacking.',
        actual_rating: 4.0,
        pred_sentiment: 'Positive',
        pred_rating: 4.2,
        confidence: 0.88,
        rating_discrepancy: 'No',
        discrepancy_delta: 0.2,
      },
      {
        id: 2,
        review_text: 'Absolutely wonderful stay! Highly recommend, great breakfast and fast wifi.',
        actual_rating: 2.0,
        pred_sentiment: 'Positive',
        pred_rating: 4.8,
        confidence: 0.94,
        rating_discrepancy: 'Yes ⚠️ 1.5+ diff',
        discrepancy_delta: 2.8,
      },
      {
        id: 3,
        review_text: 'Horrible noisy corridors, rude staff, and broken shower. Complete disaster.',
        actual_rating: 5.0,
        pred_sentiment: 'Negative',
        pred_rating: 1.6,
        confidence: 0.92,
        rating_discrepancy: 'Yes ⚠️ 1.5+ diff',
        discrepancy_delta: 3.4,
      },
      {
        id: 4,
        review_text: 'The stay was average. Nothing bad, but nothing exceptional.',
        actual_rating: 3.0,
        pred_sentiment: 'Neutral',
        pred_rating: 3.1,
        confidence: 0.74,
        rating_discrepancy: 'No',
        discrepancy_delta: 0.1,
      },
      {
        id: 5,
        review_text: 'World class hotel with superb ocean views and pristine dining.',
        actual_rating: 5.0,
        pred_sentiment: 'Positive',
        pred_rating: 5.0,
        confidence: 0.99,
        rating_discrepancy: 'No',
        discrepancy_delta: 0.0,
      },
      {
        id: 6,
        review_text: "Oh, absolutely loved the 'ocean view' through the tiny gap and the 'peaceful' jackhammer at 7 AM!",
        actual_rating: 5.0,
        pred_sentiment: 'Negative',
        pred_rating: 1.8,
        confidence: 0.94,
        rating_discrepancy: 'Yes ⚠️ 1.5+ diff',
        discrepancy_delta: 3.2,
      },
    ];

    setData({
      total_processed: 50000,
      avg_predicted_rating: 4.12,
      sentiment_distribution: { Positive: 36500, Neutral: 7500, Negative: 6000 },
      discrepancy_count: 1420,
      discrepancy_percentage: 2.8,
      processing_time_ms: 12400.0,
      rows: sampleRows,
    });
  }, []);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    try {
      const res = await predictBatchCsv(uploadedFile);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportEnrichedCsv = () => {
    if (!data || !data.rows.length) return;
    const headers = ['id,review_text,actual_rating,pred_sentiment,pred_rating,rating_discrepancy'];
    const lines = data.rows.map(
      (r) =>
        `${r.id},"${r.review_text.replace(/"/g, '""')}",${r.actual_rating || ''},${r.pred_sentiment},${r.pred_rating},"${r.rating_discrepancy}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...lines].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'enriched_hotel_reviews_predictions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRows =
    data?.rows.filter((r) => {
      const matchesSearch = r.review_text.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesDiscrepancy = discrepancyOnly ? r.rating_discrepancy.includes('Yes') : true;
      return matchesSearch && matchesDiscrepancy;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-borderLight shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Batch CSV & Dataset Analyzer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bulk sentiment classification, rating regression, and rating discrepancy detection for TripAdvisor / Booking.com datasets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/export-sample-csv"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV Template</span>
          </a>
        </div>
      </div>

      {/* Drag & Drop Upload Zone (Matches Screenshot 3) */}
      <div className="bg-white p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors shadow-card text-center relative group">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {file ? file.name : 'Upload TripAdvisor / Booking.com CSV (50,000+ rows)'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Drag & drop your CSV here, or <span className="text-blue-600 font-semibold underline">browse files</span> (Max 100MB)
            </p>
          </div>

          {/* Progress Bar (Matches Screenshot 3) */}
          <div className="pt-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full bg-blue-600 rounded-full transition-all duration-700 ${
                  loading ? 'w-2/3 animate-pulse' : 'w-full'
                }`}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
              <span className="font-mono text-[11px]">
                {loading ? 'Processing BERT embeddings...' : `100% Processed (${data?.total_processed.toLocaleString()} / ${data?.total_processed.toLocaleString()} rows)`}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Summary Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-borderLight shadow-card">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Rows Processed
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              {data.total_processed.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              Time: {(data.processing_time_ms / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-borderLight shadow-card">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Average Predicted Rating
            </span>
            <div className="text-xl font-extrabold text-slate-900 font-mono flex items-baseline gap-1">
              {data.avg_predicted_rating.toFixed(2)} <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
              Continuous MSE Scaled
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-borderLight shadow-card">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Rating Discrepancies
            </span>
            <div className="text-xl font-extrabold text-rose-600 font-mono flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{data.discrepancy_count.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-rose-600 font-medium mt-1 block">
              {data.discrepancy_percentage}% (|Actual - Pred| ≥ 1.5)
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-borderLight shadow-card flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Enriched Dataset
              </span>
              <span className="text-xs text-slate-500 block">Export predictions</span>
            </div>
            <button
              onClick={exportEnrichedCsv}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Data Preview Table (Matches Screenshot 3) */}
      <div className="bg-white rounded-xl border border-borderLight shadow-card overflow-hidden">
        <div className="p-5 border-b border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Data Preview (Displaying rows from dataset)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review text alongside actual stars, predicted sentiment, regression score, and discrepancy flag.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter preview rows..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-borderLight rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Toggle Discrepancy Only */}
            <button
              onClick={() => setDiscrepancyOnly(!discrepancyOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                discrepancyOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-300 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-borderLight hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Discrepancies Only</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-borderLight">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Review Text</th>
                <th className="py-3 px-4 w-28">Actual Rating</th>
                <th className="py-3 px-4 w-36">Predicted Sentiment</th>
                <th className="py-3 px-4 w-32">Predicted Rating</th>
                <th className="py-3 px-4 w-40">Rating Discrepancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight">
              {filteredRows.map((row) => {
                const isDiscrepant = row.rating_discrepancy.includes('Yes');
                return (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{row.id}</td>
                    <td className="py-3 px-4 font-sans text-slate-800 max-w-md">
                      {row.review_text}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {row.actual_rating ? (
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          {row.actual_rating}★
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <SentimentPill sentiment={row.pred_sentiment} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {row.pred_rating.toFixed(1)} <span className="text-slate-400 font-normal">/ 5.0</span>
                    </td>
                    <td className="py-3 px-4">
                      {isDiscrepant ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Yes ⚠️ 1.5+ diff</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
