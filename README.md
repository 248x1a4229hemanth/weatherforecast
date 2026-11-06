# WeatherSphere – Smart Weather Forecasting Application

WeatherSphere is an enterprise-grade, responsive, full-stack weather intelligence dashboard built with React, TypeScript, Vite, Tailwind CSS, Express, and Leaflet. Designed for real-time atmospheric tracking, hyper-local forecasts, interactive radar visualization, air quality analysis, and intelligent lifestyle recommendations.

---

## 🌟 Key Features

1. **Real-Time Global Weather Tracking**
   - Live temperature with high/low bounds and feels-like calculations.
   - Comprehensive atmospheric metrics: relative humidity, wind velocity, compass direction, gusts, barometric pressure, optical visibility, UV index, cloud coverage, and dew point.
   - Dynamic atmospheric color theme that automatically shifts based on real-time sky conditions (sunny, overcast, rain, severe storm, snow, and nighttime).

2. **24-Hour & 10-Day Forecasts**
   - Horizontally scrollable 24–36 hour hourly forecast timeline with precipitation probabilities and wind vectors.
   - 10-day extended forecast with relative temperature range bars and expandable daily ephemeris (solar, UV, wind, and precipitation accumulation).

3. **Interactive Recharts Visualization**
   - Multi-metric interactive charts: Temperature and Feels-Like curves, Precipitation probability and liquid equivalent, Wind speed and gusts, Relative humidity variations, and Barometric pressure trends.
   - Interactive crosshairs and tooltips with unit awareness.

4. **Live Doppler Radar & Precipitation Map**
   - Interactive Leaflet map powered by RainViewer's global radar reflection API.
   - Animated playback controls (play, pause, rewind, frame stepping) with customizable radar layer opacity and tile styles.

5. **Air Quality Index (AQI) & Pollution Monitoring**
   - Real-time US AQI calculation with standard color categories (Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous).
   - In-depth pollutant concentrations: PM2.5, PM10, Nitrogen Dioxide ($\text{NO}_2$), Surface Ozone ($\text{O}_3$), Carbon Monoxide ($\text{CO}$), and Sulphur Dioxide ($\text{SO}_2$).
   - Health advisories tailored for sensitive groups and athletic exertion.

6. **Celestial & Astronomy Cycles**
   - Solar daylight arc tracking sunrise, sunset, and daylight progress percentage.
   - Lunar ephemeris engine displaying current moon phase (Crescent, Quarter, Gibbous, Full) and illumination percentage.

7. **Smart Lifestyle & Weather Recommendations**
   - Computed recommendations for clothing, umbrella necessity, outdoor recreation/sports, UV sun protection (SPF advice), and road travel safety.

8. **Location Search & Multi-City Comparison**
   - Worldwide debounced geocoding search with autocomplete suggestions, coordinate display, and population data.
   - One-tap GPS device location integration.
   - Side-by-side comparison matrix for 2–4 global cities across temperatures, humidity, wind, AQI, and barometric pressure.
   - Persistent favorite cities and recent searches stored in `localStorage`.

9. **Customizable Units & Preferences**
   - Temperature: Celsius (°C), Fahrenheit (°F), Kelvin (K).
   - Wind speed: km/h, m/s, mph.
   - Pressure: hPa, mmHg, inHg.
   - Theme engine: Dark, Light, System, or Weather Dynamic.

10. **Progressive Web App (PWA) & Offline Mode**
    - Service worker asset precaching and runtime caching.
    - Web app manifest with home screen icons (`192x192`, `512x512`, `maskable`, `apple-touch-icon`).
    - In-app install banner with iOS Safari installation guidance.
    - Automatic offline fallback using local cached telemetry when network disconnects.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts, Leaflet, Motion.
- **Backend**: Node.js, Express.js REST API with in-memory TTL caching and request deduplication.
- **Meteorological Data**: Open-Meteo API, WMO Global Sensor Array, RainViewer Radar API, and optional OpenWeatherMap integration.
- **Testing**: Built-in Node test runner (`node:test`) and TypeScript compiler verification (`tsc`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (serves frontend + backend on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (or use `.env.example` as a template):

```env
# Optional: OpenWeatherMap API key (WeatherSphere defaults to Open-Meteo if left empty)
OPENWEATHER_API_KEY=""

# Optional: Gemini API key for AI Studio
GEMINI_API_KEY=""

# Port (default 3000)
PORT=3000
```

---

## 🧪 Running Tests

WeatherSphere includes automated unit and integration tests covering unit conversions, WMO code parsing, AQI classifications, and recommendation algorithms:

```bash
npm test
```

To run lint checks:

```bash
npm run lint
```

To create a production build:

```bash
npm run build
```

---

## 📁 Project Architecture

```
├── server/
│   ├── routes/
│   │   └── weatherRoutes.ts    # REST endpoints (/report, /current, /forecast, /air-quality, /radar, /compare)
│   └── services/
│       ├── astronomyService.ts # Solar progress & lunar cycle ephemeris
│       ├── insightsService.ts  # Lifestyle recommendations (clothing, umbrella, UV, travel)
│       └── weatherService.ts   # Core Open-Meteo / WMO fetcher & TTL caching
├── src/
│   ├── components/
│   │   ├── AirQualityCard.tsx           # AQI gauge & pollutant breakdown
│   │   ├── AstronomyCard.tsx            # Daylight arc & lunar phase
│   │   ├── CityComparisonView.tsx       # Multi-city side-by-side comparison
│   │   ├── CurrentWeatherHero.tsx       # Hero card with dynamic weather tinting
│   │   ├── DailyForecastList.tsx        # 10-day forecast with expandable details
│   │   ├── HourlyForecastTimeline.tsx   # 24-hour horizontal forecast timeline
│   │   ├── InteractiveWeatherCharts.tsx # Recharts temperature, rain, wind, pressure
│   │   ├── Navbar.tsx                   # Top bar, geocode search, GPS, unit toggles
│   │   ├── PWAInstallButton.tsx         # Cross-platform PWA installer
│   │   ├── SavedLocationsView.tsx       # Favorite locations manager
│   │   ├── SettingsModal.tsx            # Preferences, units, and themes
│   │   ├── Sidebar.tsx                  # Desktop sidebar & mobile navigation
│   │   ├── WeatherAlertsBanner.tsx      # Severe weather warnings banner
│   │   ├── WeatherMapLeaflet.tsx        # Live Doppler radar map
│   │   ├── WeatherMetricsGrid.tsx       # 8-card atmospheric parameters grid
│   │   └── WeatherInsightsCard.tsx      # Lifestyle recommendations
│   ├── context/
│   │   └── WeatherContext.tsx           # Global state, offline cache, preferences
│   ├── hooks/
│   │   └── usePWAInstall.ts             # PWA installation event hook
│   ├── types/
│   │   └── weather.ts                   # Unified TypeScript schemas
│   ├── utils/
│   │   ├── units.ts                     # Unit converters (°C/°F/K, km/h/mph, hPa/inHg)
│   │   └── weatherIcons.tsx             # Semantic weather icon renderer
│   ├── App.tsx                          # Root application component
│   ├── index.css                        # Tailwind v4 dark variant, fonts, Leaflet styling
│   └── main.tsx                         # Entry point
├── server.ts                            # Express + Vite middleware full-stack server
├── test/
│   └── weather.test.ts                  # Test suites
└── package.json
```

---

## 📄 License
Apache-2.0
