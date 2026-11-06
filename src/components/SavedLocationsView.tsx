import React from 'react';
import { Bookmark, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.js';
import { LocationData } from '../types/weather.js';

export const SavedLocationsView: React.FC = () => {
  const { preferences, loadLocation, toggleFavorite, setCurrentView } = useWeather();
  const { savedLocations } = preferences;

  const handleSelect = (loc: LocationData) => {
    loadLocation(loc);
    setCurrentView('dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-cyan-400" />
          <span>Saved Weather Locations</span>
        </h2>
        <p className="text-xs text-slate-400">
          Quickly switch between your pinned cities, travel destinations, and weather monitors
        </p>
      </div>

      {savedLocations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <Bookmark className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Saved Cities Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Search for any city using the top search bar and click the bookmark icon on the weather
            card to pin it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedLocations.map((loc) => (
            <div
              key={loc.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-white">{loc.name}</h3>
                    <div className="text-xs text-slate-400">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(loc)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Coordinates: {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
              </div>

              <button
                onClick={() => handleSelect(loc)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group-hover:bg-cyan-600 group-hover:text-white"
              >
                <span>View Live Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
