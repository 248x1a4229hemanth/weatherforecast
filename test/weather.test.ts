import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  convertTemperature,
  formatTemperature,
  convertWindSpeed,
  formatWindSpeed,
  convertPressure,
  formatPressure,
  getWindDirectionCompass,
} from '../src/utils/units.js';
import { parseWeatherCode, getAqiCategory } from '../server/services/weatherService.js';
import { calculateAstronomy } from '../server/services/astronomyService.js';
import { generateWeatherInsights } from '../server/services/insightsService.js';

describe('Unit Conversion Utilities', () => {
  test('converts Celsius to Fahrenheit correctly', () => {
    assert.strictEqual(convertTemperature(0, 'fahrenheit'), 32);
    assert.strictEqual(convertTemperature(100, 'fahrenheit'), 212);
    assert.strictEqual(convertTemperature(25, 'fahrenheit'), 77);
  });

  test('converts Celsius to Kelvin correctly', () => {
    assert.strictEqual(convertTemperature(0, 'kelvin'), 273);
    assert.strictEqual(convertTemperature(25, 'kelvin'), 298);
  });

  test('formats temperature with correct unit symbol', () => {
    assert.strictEqual(formatTemperature(20, 'celsius'), '20°C');
    assert.strictEqual(formatTemperature(20, 'fahrenheit'), '68°F');
    assert.strictEqual(formatTemperature(20, 'kelvin'), '293 K');
  });

  test('converts and formats wind speed', () => {
    assert.strictEqual(convertWindSpeed(36, 'ms'), 10);
    assert.strictEqual(convertWindSpeed(100, 'mph'), 62);
    assert.strictEqual(formatWindSpeed(10, 'kmh'), '10 km/h');
  });

  test('converts and formats pressure', () => {
    assert.strictEqual(convertPressure(1013, 'hPa'), 1013);
    assert.strictEqual(convertPressure(1013, 'mmHg'), 760);
    assert.strictEqual(formatPressure(1013, 'inHg'), '29.91 inHg');
  });

  test('computes correct compass directions', () => {
    assert.strictEqual(getWindDirectionCompass(0), 'N');
    assert.strictEqual(getWindDirectionCompass(90), 'E');
    assert.strictEqual(getWindDirectionCompass(180), 'S');
    assert.strictEqual(getWindDirectionCompass(270), 'W');
  });
});

describe('Meteorological Parsing & Categorization', () => {
  test('parses WMO weather codes correctly', () => {
    const clearDay = parseWeatherCode(0, true);
    assert.strictEqual(clearDay.condition, 'Sunny');
    assert.strictEqual(clearDay.icon, 'Sun');

    const clearNight = parseWeatherCode(0, false);
    assert.strictEqual(clearNight.condition, 'Clear');
    assert.strictEqual(clearNight.icon, 'Moon');

    const thunderstorm = parseWeatherCode(95, true);
    assert.strictEqual(thunderstorm.condition, 'Thunderstorm');
    assert.strictEqual(thunderstorm.icon, 'CloudLightning');
  });

  test('categorizes AQI levels accurately', () => {
    const good = getAqiCategory(35);
    assert.strictEqual(good.category, 'Good');

    const moderate = getAqiCategory(75);
    assert.strictEqual(moderate.category, 'Moderate');

    const unhealthy = getAqiCategory(160);
    assert.strictEqual(unhealthy.category, 'Unhealthy');

    const hazardous = getAqiCategory(350);
    assert.strictEqual(hazardous.category, 'Hazardous');
  });
});

describe('Astronomy & Insights Algorithms', () => {
  test('calculates lunar phase and illumination', () => {
    const astro = calculateAstronomy('2026-11-06T06:00:00Z', '2026-11-06T18:00:00Z');
    assert.ok(astro.moonPhase.length > 0);
    assert.ok(astro.moonIllumination >= 0 && astro.moonIllumination <= 100);
  });

  test('generates sensible clothing and umbrella recommendations', () => {
    const dummyCurrent = {
      temperature: 5,
      feelsLike: 2,
      tempMin: 0,
      tempMax: 8,
      humidity: 80,
      pressure: 1012,
      windSpeed: 15,
      windDirection: 180,
      uvIndex: 2,
      visibility: 10000,
      cloudCover: 80,
      dewPoint: 2,
      precipitation: 2.5,
      weatherCode: 61,
      condition: 'Light Rain',
      description: 'Gentle steady rain',
      icon: 'CloudRain',
      isDay: true,
      timestamp: new Date().toISOString(),
      localTime: '12:00 PM',
    };

    const dummyHourly = [
      {
        time: new Date().toISOString(),
        timestamp: Date.now(),
        temperature: 5,
        feelsLike: 2,
        humidity: 80,
        precipitationProbability: 80,
        precipitation: 2.0,
        weatherCode: 61,
        condition: 'Light Rain',
        icon: 'CloudRain',
        windSpeed: 15,
        windDirection: 180,
        uvIndex: 2,
        isDay: true,
        pressure: 1012,
      },
    ];

    const insights = generateWeatherInsights(dummyCurrent, dummyHourly);
    const umbrellaRec = insights.recommendations.find((r) => r.type === 'umbrella');
    assert.ok(umbrellaRec);
    assert.strictEqual(umbrellaRec.status, 'alert');

    const clothingRec = insights.recommendations.find((r) => r.type === 'clothing');
    assert.ok(clothingRec);
    assert.strictEqual(clothingRec.title, 'Warm Layers Required');
  });
});
