// Simple test for AccuWeather API

const ACCUWEATHER_API_KEY = '1bNiLYXsvEC71HBvPVdN9rB1oMT7gGhW';
const BASE_URL = 'https://dataservice.accuweather.com';

// Helper for GET requests
async function accuFetch(path, params = {}) {
  // build query string
  const url = new URL(`${BASE_URL}${path}`);
  url.search = new URLSearchParams({ apikey: ACCUWEATHER_API_KEY, ...params });

  console.log('Fetching URL:', url.toString());
  
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AccuWeather API error: ${res.status} ${err}`);
  }
  return res.json();
}

/**
 * Get the Location Key for a given city name
 */
async function getLocationKey(cityName) {
  const results = await accuFetch('/locations/v1/cities/search', {
    q: cityName,
    language: 'en-us',
  });

  if (results.length === 0) {
    throw new Error(`No location found for "${cityName}"`);
  }
  // return the first match's key
  return results[0].Key;
}

/**
 * Get the current weather conditions for a Location Key
 */
async function getCurrentConditions(locationKey) {
  const data = await accuFetch(`/currentconditions/v1/${locationKey}`, {
    details: true,
  });
  // data is an array; index 0 holds the current conditions
  return data[0];
}

// Run the test
async function runTest() {
  try {
    console.log('Testing AccuWeather API...');
    
    // Test location search
    console.log('\nTesting location search for "Hunza"...');
    const key = await getLocationKey('Hunza');
    console.log('Location key:', key);
    
    // Test current conditions
    console.log('\nTesting current conditions...');
    const weather = await getCurrentConditions(key);
    console.log('Current weather:');
    console.log(`${weather.WeatherText}, ${weather.Temperature.Metric.Value}°${weather.Temperature.Metric.Unit}`);
    console.log(`Feels like ${weather.RealFeelTemperature.Metric.Value}°${weather.RealFeelTemperature.Metric.Unit}`);
    
    console.log('\nAll tests passed!');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTest();
