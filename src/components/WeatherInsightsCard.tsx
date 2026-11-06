import React from 'react';
import {
  Sparkles,
  Shirt,
  Umbrella,
  Bike,
  Sun,
  Car,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { WeatherInsights, WeatherRecommendation } from '../types/weather.js';

interface WeatherInsightsCardProps {
  insights: WeatherInsights;
}

export const WeatherInsightsCard: React.FC<WeatherInsightsCardProps> = ({ insights }) => {
  if (!insights) return null;

  const getIcon = (type: WeatherRecommendation['type']) => {
    switch (type) {
      case 'clothing':
        return Shirt;
      case 'umbrella':
        return Umbrella;
      case 'outdoor':
        return Bike;
      case 'sun':
        return Sun;
      case 'travel':
        return Car;
      default:
        return Sparkles;
    }
  };

  const getStatusBadge = (status: WeatherRecommendation['status']) => {
    switch (status) {
      case 'positive':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: CheckCircle2,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: AlertCircle,
        };
      case 'alert':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: AlertCircle,
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
          icon: HelpCircle,
        };
    }
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Smart Lifestyle & Weather Recommendations
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Computed from Meteorological Sensors
        </span>
      </div>

      {/* Summary Box */}
      {insights.summary && (
        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
          <strong className="text-white">Current Synopsis: </strong>
          {insights.summary}
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.recommendations.map((rec, i) => {
          const Icon = getIcon(rec.type);
          const badge = getStatusBadge(rec.status);
          const StatusIcon = badge.icon;

          return (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{rec.title}</span>
                </div>
                <StatusIcon className={`w-3.5 h-3.5 ${rec.status === 'positive' ? 'text-emerald-400' : rec.status === 'warning' ? 'text-amber-400' : 'text-rose-400'}`} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rec.message}</p>
            </div>
          );
        })}
      </div>

      {/* Weather Highlights */}
      {insights.highlights.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Atmospheric Highlights
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.highlights.map((h, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/70 text-slate-300 border border-slate-700/60"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
