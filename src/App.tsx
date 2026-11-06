import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { WeatherAlertsBanner } from './components/WeatherAlertsBanner.js';
import { CurrentWeatherHero } from './components/CurrentWeatherHero.js';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid.js';
import { HourlyForecastTimeline } from './components/HourlyForecastTimeline.js';
import { DailyForecastList } from './components/DailyForecastList.js';
import { InteractiveWeatherCharts } from './components/InteractiveWeatherCharts.js';
import { AirQualityCard } from './components/AirQualityCard.js';
import { AstronomyCard } from './components/AstronomyCard.js';
import { WeatherInsightsCard } from './components/WeatherInsightsCard.js';
import { WeatherMapLeaflet } from './components/WeatherMapLeaflet.js';
import { CityComparisonView } from './components/CityComparisonView.js';
import { SavedLocationsView } from './components/SavedLocationsView.js';
import { SettingsModal } from './components/SettingsModal.js';
import { Loader2, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

function DashboardContent() {
  const { report, loading, error, refresh, currentView, isOffline } = useWeather();

  // Offline banner notice
  const renderOfflineNotice = () => {
    if (!isOffline) return null;
    return (
      <div className="mb-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
          <span>You are currently offline. WeatherSphere is displaying cached telemetry.</span>
        </div>
        <button
          onClick={refresh}
          className="font-semibold underline hover:text-white transition-colors"
        >
          Check Connection
        </button>
      </div>
    );
  };

  // Error state
  if (error && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white">Meteorological Service Notice</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">{error}</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Weather Query</span>
        </button>
      </div>
    );
  }

  // Initial loading state
  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-white">Initializing WeatherSphere Core</p>
          <p className="text-xs text-slate-400">Connecting to WMO & Open-Meteo satellite arrays...</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-7xl mx-auto">
      {renderOfflineNotice()}

      {/* View Switching */}
      {currentView === 'dashboard' && (
        <>
          {/* Weather Alerts if any */}
          {report.alerts.length > 0 && <WeatherAlertsBanner alerts={report.alerts} />}

          {/* Current Weather Hero */}
          <CurrentWeatherHero
            current={report.current}
            location={report.location}
            todayDaily={report.daily[0]}
          />

          {/* 8-Card Meteorological Metrics Grid */}
          <WeatherMetricsGrid current={report.current} />

          {/* 24-Hour Forecast Timeline */}
          <HourlyForecastTimeline hourly={report.hourly} />

          {/* 10-Day Extended Forecast */}
          <DailyForecastList daily={report.daily} />

          {/* Interactive Recharts Dynamics */}
          <InteractiveWeatherCharts hourly={report.hourly} />

          {/* Live Doppler Radar Map */}
          <WeatherMapLeaflet location={report.location} current={report.current} />

          {/* Dual Column: Air Quality & Astronomy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AirQualityCard airQuality={report.airQuality} />
            <AstronomyCard astronomy={report.astronomy} todayDaily={report.daily[0]} />
          </div>

          {/* Smart Weather Recommendations & Insights */}
          <WeatherInsightsCard insights={report.insights} />
        </>
      )}

      {currentView === 'forecast' && (
        <div className="space-y-6">
          <DailyForecastList daily={report.daily} />
          <HourlyForecastTimeline hourly={report.hourly} />
          <InteractiveWeatherCharts hourly={report.hourly} />
        </div>
      )}

      {currentView === 'radar' && (
        <div className="space-y-6">
          <WeatherMapLeaflet location={report.location} current={report.current} />
          <HourlyForecastTimeline hourly={report.hourly} />
        </div>
      )}

      {currentView === 'air-quality' && (
        <div className="space-y-6">
          <AirQualityCard airQuality={report.airQuality} />
          <WeatherMetricsGrid current={report.current} />
        </div>
      )}

      {currentView === 'compare' && <CityComparisonView />}

      {currentView === 'favorites' && <SavedLocationsView />}

      {currentView === 'settings' && <SettingsModal />}
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <DashboardContent />
          </main>
        </div>
      </div>
    </WeatherProvider>
  );
}
