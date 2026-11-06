import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  Wind,
  Layers,
  Bookmark,
  Settings,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext.js';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, preferences, isOffline, cachedAt } = useWeather();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: '10-Day Forecast', icon: CalendarDays },
    { id: 'radar', label: 'Weather Radar', icon: Map },
    { id: 'air-quality', label: 'Air Quality', icon: Wind },
    { id: 'compare', label: 'Compare Cities', icon: Layers },
    {
      id: 'favorites',
      label: 'Saved Cities',
      icon: Bookmark,
      badge: preferences.savedLocations.length,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-60 border-r border-slate-800/80 bg-slate-950/60 p-4 shrink-0">
        <div className="space-y-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== 0 && item.badge !== '0' && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Network & Cache Status footer */}
        <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-1.5">
              {isOffline ? (
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span>{isOffline ? 'Offline Mode' : 'Live Connected'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {cachedAt ? `Synced ${cachedAt}` : ''}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Data: WMO & Open-Meteo API
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-lg px-2 py-1.5">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
              currentView === 'settings'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};
