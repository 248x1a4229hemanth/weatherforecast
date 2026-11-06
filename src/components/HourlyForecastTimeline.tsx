import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { HourlyForecastItem } from '../types/weather.js';
import { formatTemperature, formatWindSpeed } from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';
import { WeatherIcon } from '../utils/weatherIcons.js';

interface HourlyForecastTimelineProps {
  hourly: HourlyForecastItem[];
}

export const HourlyForecastTimeline: React.FC<HourlyForecastTimelineProps> = ({ hourly }) => {
  const { preferences } = useWeather();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white">
            24-Hour Forecast Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Hourly temperature trends, precipitation probability & winds
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto py-3 no-scrollbar scroll-smooth"
      >
        {hourly.slice(0, 28).map((item, index) => {
          const date = new Date(item.time);
          const isFirst = index === 0;
          const timeLabel = isFirst
            ? 'Now'
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between min-w-[84px] py-3 px-2 rounded-xl border transition-colors shrink-0 ${
                isFirst
                  ? 'bg-cyan-950/30 border-cyan-500/40'
                  : 'bg-slate-900/80 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-300 whitespace-nowrap">
                {timeLabel}
              </span>

              <div className="my-2.5">
                <WeatherIcon name={item.icon} className="w-7 h-7" isDay={item.isDay} />
              </div>

              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {formatTemperature(item.temperature, preferences.tempUnit)}
              </span>

              {/* Rain Probability */}
              <div className="flex items-center gap-1 mt-2 text-[10px] text-sky-400 font-mono">
                <Droplets className="w-3 h-3 shrink-0" />
                <span>{item.precipitationProbability}%</span>
              </div>

              {/* Wind Speed */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                <Wind className="w-2.5 h-2.5 shrink-0" />
                <span>{formatWindSpeed(item.windSpeed, preferences.windUnit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
