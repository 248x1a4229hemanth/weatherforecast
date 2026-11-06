import React, { useState } from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyForecastItem } from '../types/weather.js';
import { formatTemperature, formatWindSpeed } from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';
import { WeatherIcon } from '../utils/weatherIcons.js';

interface DailyForecastListProps {
  daily: DailyForecastItem[];
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ daily }) => {
  const { preferences } = useWeather();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (!daily || daily.length === 0) return null;

  // Calculate absolute min & max across the entire 10-day dataset for normalized visual bar
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const minTemp = Math.min(...allMins);
  const maxTemp = Math.max(...allMaxs);
  const range = Math.max(1, maxTemp - minTemp);

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white">
            10-Day Extended Forecast
          </h2>
          <p className="text-xs text-slate-400">
            Click any day to view atmospheric breakdown, UV ratings, and daylight
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {daily.map((day, idx) => {
          const dateObj = new Date(day.date);
          const isToday = idx === 0;
          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const isExpanded = expandedDate === day.date;

          // Bar calculations
          const leftPercent = Math.max(0, ((day.tempMin - minTemp) / range) * 100);
          const widthPercent = Math.max(10, ((day.tempMax - day.tempMin) / range) * 100);

          return (
            <div key={day.date} className="py-2.5 transition-colors">
              <div
                onClick={() => toggleExpand(day.date)}
                className="flex items-center justify-between gap-3 cursor-pointer py-1 px-1 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                {/* Day Name & Date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {dayName}
                  </div>
                  <div className="text-[11px] text-slate-400">{formattedDate}</div>
                </div>

                {/* Weather Icon & Condition */}
                <div className="flex items-center gap-2 w-32 sm:w-36 shrink-0">
                  <WeatherIcon name={day.icon} className="w-6 h-6 shrink-0" isDay={true} />
                  <span className="text-xs font-medium text-slate-200 truncate hidden sm:inline">
                    {day.condition}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="w-14 sm:w-16 shrink-0 text-left">
                  {day.precipitationProbability > 0 ? (
                    <div className="flex items-center gap-1 text-[11px] text-sky-400 font-mono">
                      <Droplets className="w-3 h-3" />
                      <span>{day.precipitationProbability}%</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">0%</span>
                  )}
                </div>

                {/* Visual Temperature Range Bar */}
                <div className="flex-1 flex items-center gap-2 max-w-xs">
                  <span className="text-xs font-mono text-slate-400 w-10 text-right tabular-nums">
                    {formatTemperature(day.tempMin, preferences.tempUnit)}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-white font-semibold w-10 text-left tabular-nums">
                    {formatTemperature(day.tempMax, preferences.tempUnit)}
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="shrink-0 text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* In-depth details view when clicked */}
              {isExpanded && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Peak Wind Speed</div>
                      <div className="font-mono font-medium">
                        {formatWindSpeed(day.windSpeedMax, preferences.windUnit)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Max UV Index</div>
                      <div className="font-mono font-medium">{day.uvIndexMax}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Sunrise className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Sunrise</div>
                      <div className="font-mono font-medium">
                        {new Date(day.sunrise).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Sunset</div>
                      <div className="font-mono font-medium">
                        {new Date(day.sunset).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Description: {day.description}</span>
                    <span>Expected Liquid Total: {day.precipitationSum} mm</span>
                    <span>Daylight: {day.daylightDurationHours} hrs</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
