import React from 'react';
import { Sunrise, Sunset, Moon, Sun, Clock } from 'lucide-react';
import { AstronomyData, DailyForecastItem } from '../types/weather.js';

interface AstronomyCardProps {
  astronomy: AstronomyData;
  todayDaily?: DailyForecastItem;
}

export const AstronomyCard: React.FC<AstronomyCardProps> = ({ astronomy, todayDaily }) => {
  if (!astronomy) return null;

  const { sunrise, sunset, daylightProgress, moonPhase, moonIllumination } = astronomy;
  const daylightHours = todayDaily?.daylightDurationHours || 12;

  const sunriseTime = sunrise
    ? new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const sunsetTime = sunset
    ? new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Astronomy & Celestial Cycles
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Solar & Lunar Ephemeris
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sun & Daylight Arc */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Solar Daylight Arc</span>
            </span>
            <span className="font-mono text-slate-400">{daylightHours}h daylight</span>
          </div>

          {/* Daylight progress bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 transition-all duration-500"
                style={{ width: `${Math.round(daylightProgress * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                <span>{sunriseTime}</span>
              </span>
              <span className="flex items-center gap-1">
                <Sunset className="w-3.5 h-3.5 text-orange-400" />
                <span>{sunsetTime}</span>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            {astronomy.isDay ? 'Sun is currently above horizon' : 'Sun is currently below horizon'}
          </div>
        </div>

        {/* Moon Phase & Illumination */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-300" />
              <span>Lunar Phase</span>
            </span>
            <span className="font-mono text-indigo-300 font-semibold">{moonIllumination}% Illuminated</span>
          </div>

          <div className="flex items-center gap-4 py-1">
            {/* Visual representation of Moon */}
            <div className="relative w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              <div
                className="absolute inset-0 bg-indigo-200 opacity-90 rounded-full transition-all"
                style={{
                  clipPath:
                    moonIllumination > 50
                      ? `inset(0 0 0 0)`
                      : `inset(0 0 0 ${100 - moonIllumination * 1.8}%)`,
                }}
              />
              <Moon className="relative z-10 w-6 h-6 text-slate-900" />
            </div>

            <div className="space-y-0.5">
              <div className="text-sm font-bold text-white">{moonPhase}</div>
              <div className="text-[11px] text-slate-400">Synodic month cycle 29.53 days</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Next full lunar transition occurring in synodic orbital tracking.
          </div>
        </div>
      </div>
    </div>
  );
};
