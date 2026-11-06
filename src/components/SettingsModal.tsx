import React from 'react';
import {
  Thermometer,
  Wind,
  Gauge,
  Palette,
  Bell,
  MapPin,
  Check,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext.js';
import { TemperatureUnit, WindUnit, PressureUnit, ThemeMode } from '../types/weather.js';

export const SettingsModal: React.FC = () => {
  const { preferences, updatePreferences, report } = useWeather();

  const tempOptions: Array<{ id: TemperatureUnit; label: string; symbol: string }> = [
    { id: 'celsius', label: 'Celsius', symbol: '°C' },
    { id: 'fahrenheit', label: 'Fahrenheit', symbol: '°F' },
    { id: 'kelvin', label: 'Kelvin', symbol: 'K' },
  ];

  const windOptions: Array<{ id: WindUnit; label: string }> = [
    { id: 'kmh', label: 'Kilometers per hour (km/h)' },
    { id: 'ms', label: 'Meters per second (m/s)' },
    { id: 'mph', label: 'Miles per hour (mph)' },
  ];

  const pressureOptions: Array<{ id: PressureUnit; label: string }> = [
    { id: 'hPa', label: 'Hectopascal (hPa / mbar)' },
    { id: 'mmHg', label: 'Millimeters of Mercury (mmHg)' },
    { id: 'inHg', label: 'Inches of Mercury (inHg)' },
  ];

  const themeOptions: Array<{ id: ThemeMode; label: string; desc: string }> = [
    { id: 'dark', label: 'Dark Mode', desc: 'Sleek slate-950 deep contrast' },
    { id: 'light', label: 'Light Mode', desc: 'High-clarity clean neutral canvas' },
    { id: 'system', label: 'System Default', desc: 'Syncs with operating system theme' },
    { id: 'weather', label: 'Weather Dynamic', desc: 'Adapts color temperature to sky conditions' },
  ];

  const handleSetCurrentAsDefault = () => {
    if (report) {
      updatePreferences({ defaultLocation: report.location });
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Application Preferences & Units
        </h2>
        <p className="text-xs text-slate-400">
          Customize meteorological measurement scales, interface appearance, and default telemetry
        </p>
      </div>

      {/* Temperature Unit */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          <span>Temperature Scale</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tempOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updatePreferences({ tempUnit: opt.id })}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all ${
                preferences.tempUnit === opt.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{opt.label}</span>
              <span className="font-mono text-cyan-400 font-bold">{opt.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wind Speed Unit */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Wind className="w-4 h-4 text-teal-400" />
          <span>Wind Velocity Units</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {windOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updatePreferences({ windUnit: opt.id })}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all text-left ${
                preferences.windUnit === opt.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{opt.label}</span>
              {preferences.windUnit === opt.id && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Barometric Pressure Unit */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Gauge className="w-4 h-4 text-indigo-400" />
          <span>Barometric Atmospheric Pressure</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pressureOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updatePreferences({ pressureUnit: opt.id })}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all text-left ${
                preferences.pressureUnit === opt.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{opt.label}</span>
              {preferences.pressureUnit === opt.id && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Display Theme System</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updatePreferences({ theme: opt.id })}
              className={`p-3.5 rounded-xl border text-xs transition-all text-left space-y-1 ${
                preferences.theme === opt.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{opt.label}</span>
                {preferences.theme === opt.id && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Default Startup Location */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Default Startup Location</span>
          </div>
          {report && (
            <button
              onClick={handleSetCurrentAsDefault}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
            >
              Set Current City ({report.location.name}) as Default
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Currently configured:{' '}
          <strong className="text-slate-200">
            {preferences.defaultLocation
              ? `${preferences.defaultLocation.name}, ${preferences.defaultLocation.country}`
              : 'Vijayawada, India (Initial default)'}
          </strong>
        </p>
      </div>

      {/* Notifications */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bell className="w-4 h-4 text-yellow-400" />
            <span>Severe Weather Alert Push Notifications</span>
          </div>
          <button
            onClick={() => {
              if (!preferences.notificationsEnabled && 'Notification' in window) {
                Notification.requestPermission().then((perm) => {
                  updatePreferences({ notificationsEnabled: perm === 'granted' });
                });
              } else {
                updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled });
              }
            }}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              preferences.notificationsEnabled ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                preferences.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Receive browser alerts for thunderstorm cells, gale warnings, and extreme air quality events.
        </p>
      </div>
    </div>
  );
};
