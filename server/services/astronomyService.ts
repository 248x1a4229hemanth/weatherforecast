import { AstronomyData } from '../../src/types/weather.js';

export function calculateAstronomy(
  sunriseStr: string,
  sunsetStr: string,
  targetDate: Date = new Date()
): AstronomyData {
  // Calculate moon phase based on known synodic month (29.53058867 days)
  // Reference new moon: Jan 11, 2024
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const now = targetDate.getTime();
  const synodicMonthMs = 29.53058867 * 24 * 60 * 60 * 1000;
  const elapsed = (now - knownNewMoon) % synodicMonthMs;
  const phaseValue = (elapsed < 0 ? elapsed + synodicMonthMs : elapsed) / synodicMonthMs;

  let moonPhase = 'New Moon';
  if (phaseValue >= 0.03 && phaseValue < 0.22) {
    moonPhase = 'Waxing Crescent';
  } else if (phaseValue >= 0.22 && phaseValue < 0.28) {
    moonPhase = 'First Quarter';
  } else if (phaseValue >= 0.28 && phaseValue < 0.47) {
    moonPhase = 'Waxing Gibbous';
  } else if (phaseValue >= 0.47 && phaseValue < 0.53) {
    moonPhase = 'Full Moon';
  } else if (phaseValue >= 0.53 && phaseValue < 0.72) {
    moonPhase = 'Waning Gibbous';
  } else if (phaseValue >= 0.72 && phaseValue < 0.78) {
    moonPhase = 'Last Quarter';
  } else if (phaseValue >= 0.78 && phaseValue < 0.97) {
    moonPhase = 'Waning Crescent';
  }

  // Moon illumination percentage (0% at new moon, 100% at full moon)
  const moonIllumination = Math.round((1 - Math.cos(phaseValue * 2 * Math.PI)) / 2 * 100);

  // Daylight progress
  let daylightProgress = 0.5;
  let isDay = true;

  try {
    const sunriseTime = new Date(sunriseStr).getTime();
    const sunsetTime = new Date(sunsetStr).getTime();
    if (!isNaN(sunriseTime) && !isNaN(sunsetTime)) {
      if (now < sunriseTime) {
        daylightProgress = 0;
        isDay = false;
      } else if (now > sunsetTime) {
        daylightProgress = 1;
        isDay = false;
      } else {
        daylightProgress = Math.min(1, Math.max(0, (now - sunriseTime) / (sunsetTime - sunriseTime)));
        isDay = true;
      }
    }
  } catch {
    // default fallback
  }

  return {
    sunrise: sunriseStr,
    sunset: sunsetStr,
    daylightProgress: Number(daylightProgress.toFixed(2)),
    isDay,
    moonPhase,
    moonPhaseValue: Number(phaseValue.toFixed(3)),
    moonIllumination,
  };
}
