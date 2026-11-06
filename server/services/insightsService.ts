import { CurrentWeather, HourlyForecastItem, AirQualityData, WeatherInsights, WeatherRecommendation } from '../../src/types/weather.js';

export function generateWeatherInsights(
  current: CurrentWeather,
  hourly: HourlyForecastItem[],
  airQuality?: AirQualityData
): WeatherInsights {
  const recommendations: WeatherRecommendation[] = [];
  const highlights: string[] = [];

  // Next 12 hours rain probability
  const next12Hours = hourly.slice(0, 12);
  const maxRainProb = Math.max(...next12Hours.map((h) => h.precipitationProbability || 0), 0);
  const totalRainNext12 = next12Hours.reduce((acc, h) => acc + (h.precipitation || 0), 0);

  // Umbrella & Precipitation
  if (current.precipitation > 0 || maxRainProb >= 60 || totalRainNext12 > 1) {
    recommendations.push({
      type: 'umbrella',
      title: 'Umbrella Essential',
      status: 'alert',
      message: current.precipitation > 0
        ? 'Active precipitation in progress. Keep an umbrella or waterproof jacket handy.'
        : `High probability of precipitation (${maxRainProb}%) expected within the next 12 hours.`,
      icon: 'Umbrella',
    });
    highlights.push(
      current.precipitation > 0
        ? 'Active precipitation is underway in your vicinity.'
        : `Rain probability peaks at ${maxRainProb}% over the next 12 hours.`
    );
  } else if (maxRainProb >= 30) {
    recommendations.push({
      type: 'umbrella',
      title: 'Umbrella Optional',
      status: 'neutral',
      message: `Moderate chance of isolated showers (${maxRainProb}%). Carrying a compact umbrella is advised.`,
      icon: 'Umbrella',
    });
  } else {
    recommendations.push({
      type: 'umbrella',
      title: 'No Umbrella Needed',
      status: 'positive',
      message: 'Clear conditions expected with minimal or no rain probability.',
      icon: 'CloudSun',
    });
  }

  // Clothing recommendations based on feels-like temperature
  const temp = current.feelsLike;
  if (temp < 0) {
    recommendations.push({
      type: 'clothing',
      title: 'Heavy Winter Insulation',
      status: 'alert',
      message: 'Freezing conditions. Wear thermal layers, a heavy insulated parka, gloves, and a beanie.',
      icon: 'Shirt',
    });
    highlights.push('Sub-zero wind chill. Protect exposed skin from prolonged cold.');
  } else if (temp < 10) {
    recommendations.push({
      type: 'clothing',
      title: 'Warm Layers Required',
      status: 'warning',
      message: 'Chilly temperatures. A wool coat, sweater, and scarf are recommended for outdoor comfort.',
      icon: 'Shirt',
    });
  } else if (temp < 18) {
    recommendations.push({
      type: 'clothing',
      title: 'Light Jacket or Cardigan',
      status: 'neutral',
      message: 'Mild cool weather. A light jacket, fleece, or long-sleeve knitwear is ideal.',
      icon: 'Shirt',
    });
  } else if (temp < 27) {
    recommendations.push({
      type: 'clothing',
      title: 'Breathable Casual Wear',
      status: 'positive',
      message: 'Pleasantly warm. Breathable cotton t-shirts, light trousers, or shorts are comfortable.',
      icon: 'Shirt',
    });
  } else {
    recommendations.push({
      type: 'clothing',
      title: 'Ultra-Lightweight & Hydration',
      status: 'warning',
      message: 'High heat index. Wear loose, light-colored clothing and drink water frequently.',
      icon: 'Shirt',
    });
    highlights.push('Elevated heat index. Stay well-hydrated throughout the afternoon.');
  }

  // UV Sun Protection
  if (current.uvIndex >= 8) {
    recommendations.push({
      type: 'sun',
      title: 'Extreme UV Protection',
      status: 'alert',
      message: `Very high UV Index (${current.uvIndex}). Wear SPF 50+ sunscreen, UV400 sunglasses, and seek midday shade.`,
      icon: 'Sun',
    });
    highlights.push(`UV radiation is very high (index ${current.uvIndex}). Minimize direct midday sun exposure.`);
  } else if (current.uvIndex >= 5) {
    recommendations.push({
      type: 'sun',
      title: 'Moderate UV Protection',
      status: 'warning',
      message: `Moderate UV Index (${current.uvIndex}). Apply broad-spectrum sunscreen and wear sunglasses outdoors.`,
      icon: 'Sun',
    });
  } else {
    recommendations.push({
      type: 'sun',
      title: 'Low UV Hazard',
      status: 'positive',
      message: `Low UV radiation (${current.uvIndex}). No special sun protection required for short outdoor walks.`,
      icon: 'SunDim',
    });
  }

  // Outdoor Activities & Sports
  const windMph = current.windSpeed;
  const isAqiUnhealthy = airQuality && airQuality.aqi > 150;
  if (isAqiUnhealthy) {
    recommendations.push({
      type: 'outdoor',
      title: 'Limit Strenuous Outdoor Exercise',
      status: 'alert',
      message: `Elevated air pollution levels (AQI ${airQuality.aqi}). Sensitive groups and runners should exercise indoors.`,
      icon: 'Activity',
    });
    highlights.push(`Air quality is currently in the ${airQuality.category} tier.`);
  } else if (windMph > 40 || current.weatherCode >= 95) {
    recommendations.push({
      type: 'outdoor',
      title: 'Outdoor Activities Not Advised',
      status: 'alert',
      message: 'High winds or thunderstorm activity detected. Postpone cycling, boating, and high-altitude hiking.',
      icon: 'Wind',
    });
    highlights.push(`Strong gusty winds up to ${current.windGusts || current.windSpeed} km/h.`);
  } else if (temp >= 14 && temp <= 25 && maxRainProb < 20) {
    recommendations.push({
      type: 'outdoor',
      title: 'Optimal Outdoor Conditions',
      status: 'positive',
      message: 'Comfortable temperature, moderate winds, and low precipitation make this ideal for running, cycling, or picnics.',
      icon: 'Bike',
    });
    highlights.push('Excellent atmospheric window for outdoor recreation and athletics.');
  } else {
    recommendations.push({
      type: 'outdoor',
      title: 'Moderate Outdoor Conditions',
      status: 'neutral',
      message: 'Generally suitable for everyday outdoor activities with standard weather awareness.',
      icon: 'Footprints',
    });
  }

  // Travel & Commute conditions
  if (current.visibility < 1000 || current.weatherCode === 45 || current.weatherCode === 48) {
    recommendations.push({
      type: 'travel',
      title: 'Reduced Road Visibility (Fog)',
      status: 'warning',
      message: 'Low visibility due to mist or fog. Drive with low beams and increase braking distance.',
      icon: 'Car',
    });
    highlights.push(`Visibility is reduced to ${(current.visibility / 1000).toFixed(1)} km due to fog/mist.`);
  } else if (current.weatherCode >= 71 && current.weatherCode <= 86) {
    recommendations.push({
      type: 'travel',
      title: 'Winter Road Advisory',
      status: 'warning',
      message: 'Snow or sleet precipitation may cause slick road surfaces. Drive cautiously.',
      icon: 'Snowflake',
    });
    highlights.push('Wintry precipitation may create slippery transit and driving conditions.');
  } else {
    recommendations.push({
      type: 'travel',
      title: 'Normal Transit Conditions',
      status: 'positive',
      message: 'Roadways and transit corridors are experiencing standard operating conditions.',
      icon: 'Car',
    });
  }

  const summary = `Currently ${current.temperature}° with ${current.description.toLowerCase()}. Feels like ${current.feelsLike}°. ${
    maxRainProb > 40 ? `Watch for possible rain later (${maxRainProb}% chance).` : 'Dry conditions expected to prevail.'
  }`;

  return {
    highlights,
    recommendations,
    summary,
  };
}
