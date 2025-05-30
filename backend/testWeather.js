/**
 * Test script for the weather service
 *
 * Run with: node testWeather.js
 *
 * This script tests the weather service with caching enabled.
 * The first run will fetch data from the API, and subsequent runs
 * will use cached data to avoid hitting API rate limits.
 */

import {
  getLocationKey,
  getCurrentConditions,
  getForecast,
  getHourlyForecast,
  getCompleteWeatherData,
} from "./utils/weatherService.js";

import {
  getCachedLocationKey,
  getCachedWeatherData,
  clearExpiredCache,
} from "./utils/weatherCache.js";

// Test city
const CITY = "Hunza";

// Test the weather service
async function testWeatherService() {
  console.log(`Testing weather service for city: ${CITY}`);
  console.log("----------------------------------------");

  try {
    // Check if we already have a cached location key
    const cachedKey = getCachedLocationKey(CITY);
    if (cachedKey) {
      console.log(`Found cached location key for ${CITY}: ${cachedKey}`);
    }

    // Test getLocationKey
    console.log("Testing getLocationKey...");
    const locationKey = await getLocationKey(CITY);
    console.log(`Location key for ${CITY}: ${locationKey}`);
    console.log("✅ getLocationKey test passed");
    console.log("----------------------------------------");

    // Check if we have cached current conditions
    const cachedCurrent = getCachedWeatherData("current", locationKey);
    if (cachedCurrent) {
      console.log("Found cached current conditions");
    }

    // Test getCurrentConditions
    console.log("Testing getCurrentConditions...");
    const currentConditions = await getCurrentConditions(locationKey);
    console.log("Current conditions:");
    console.log(`- Weather: ${currentConditions.WeatherText}`);
    console.log(
      `- Temperature: ${currentConditions.Temperature.Metric.Value}°${currentConditions.Temperature.Metric.Unit}`
    );
    console.log(
      `- Feels like: ${currentConditions.RealFeelTemperature.Metric.Value}°${currentConditions.RealFeelTemperature.Metric.Unit}`
    );
    console.log("✅ getCurrentConditions test passed");
    console.log("----------------------------------------");

    // Check if we have cached forecast
    const cachedForecast = getCachedWeatherData("forecast", locationKey);
    if (cachedForecast) {
      console.log("Found cached forecast");
    }

    // Test getForecast
    console.log("Testing getForecast...");
    const forecast = await getForecast(locationKey);
    console.log("5-day forecast:");
    console.log(`- Headline: ${forecast.Headline.Text}`);
    console.log(`- Days in forecast: ${forecast.DailyForecasts.length}`);
    console.log("✅ getForecast test passed");
    console.log("----------------------------------------");

    // Check if we have cached hourly forecast
    const cachedHourly = getCachedWeatherData("hourly", locationKey);
    if (cachedHourly) {
      console.log("Found cached hourly forecast");
    }

    // Test getHourlyForecast
    console.log("Testing getHourlyForecast...");
    const hourlyForecast = await getHourlyForecast(locationKey);
    console.log(`Hourly forecast entries: ${hourlyForecast.length}`);
    console.log("✅ getHourlyForecast test passed");
    console.log("----------------------------------------");

    // Test getCompleteWeatherData
    console.log("Testing getCompleteWeatherData...");
    const completeData = await getCompleteWeatherData(CITY);
    console.log("Complete weather data received:");
    console.log(`- Location key: ${completeData.locationKey}`);
    console.log(`- Current weather: ${completeData.current.WeatherText}`);
    console.log(
      `- Forecast days: ${completeData.forecast.DailyForecasts.length}`
    );
    console.log(`- Hourly entries: ${completeData.hourly.length}`);
    console.log("✅ getCompleteWeatherData test passed");
    console.log("----------------------------------------");

    console.log("All tests passed! 🎉");
    console.log(
      "Note: If you run this test again, it will use cached data to avoid API rate limits."
    );
  } catch (error) {
    console.error("❌ Test failed:", error);

    // If the error is due to rate limiting, suggest using cached data
    if (
      error.message.includes("rate limit") ||
      error.message.includes("exceeded")
    ) {
      console.log("\nThe error appears to be due to API rate limiting.");
      console.log(
        "The weather data has been cached, so you can run the test again to use cached data."
      );
    }
  }
}

// Run the tests
testWeatherService();
