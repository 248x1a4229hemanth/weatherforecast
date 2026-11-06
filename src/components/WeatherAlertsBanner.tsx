import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, X } from 'lucide-react';
import { WeatherAlert } from '../types/weather.js';

interface WeatherAlertsBannerProps {
  alerts: WeatherAlert[];
}

export const WeatherAlertsBanner: React.FC<WeatherAlertsBannerProps> = ({ alerts }) => {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeAlerts = alerts.filter((a) => !dismissed.includes(a.id));
  if (activeAlerts.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2 mb-4">
      {activeAlerts.map((alert) => {
        const isExpanded = expandedId === alert.id;
        const isSevere = alert.severity === 'severe' || alert.severity === 'extreme';

        return (
          <div
            key={alert.id}
            className={`rounded-xl border p-3.5 transition-all shadow-sm ${
              isSevere
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-100'
                : 'bg-amber-950/40 border-amber-800/80 text-amber-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {isSevere ? (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-white">
                      {alert.title}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                        isSevere
                          ? 'bg-rose-900/60 text-rose-300'
                          : 'bg-amber-900/60 text-amber-300'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {alert.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleExpand(alert.id)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Toggle details"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expandable precautions */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2">
                <div className="font-semibold text-white">Recommended Safety Precautions:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {alert.precautions.map((prec, i) => (
                    <li key={i}>{prec}</li>
                  ))}
                </ul>
                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Source: {alert.source}</span>
                  <span>Effective until {new Date(alert.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
