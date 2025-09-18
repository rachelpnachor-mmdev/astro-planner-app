// test-api.js - Quick test of FreeAstrologyAPI integration
// Run with: node test-api.js

const API_KEY = '8Do7k0RlbC8bk9vqzmchXaP4J2C7L2zN3lzV7td4';
const API_URL = 'https://json.freeastrologyapi.com/western/planets';

// Test data: Sample birth info
const testBirthData = {
  year: 1990,
  month: 6,        // June
  date: 15,        // 15th
  hours: 14,       // 2 PM
  minutes: 30,     // 2:30 PM
  seconds: 0,
  latitude: 40.7128,   // New York City
  longitude: -74.0060,
  timezone: -4,        // EDT (UTC-4)
  config: {
    observation_point: 'topocentric',
    ayanamsha: 'lahiri',
    language: 'en',
  },
};

async function testAPI() {
  console.log('🌙 Testing FreeAstrologyAPI integration...');
  console.log('📍 Test birth data:', {
    date: `${testBirthData.year}-${testBirthData.month}-${testBirthData.date}`,
    time: `${testBirthData.hours}:${testBirthData.minutes}`,
    location: `${testBirthData.latitude}, ${testBirthData.longitude}`,
    timezone: `UTC${testBirthData.timezone}`
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(testBirthData),
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API Success!');
    console.log('📊 Response structure:', Object.keys(data));

    // Check for planets data
    if (data.planets) {
      console.log('🪐 Planets found:', Object.keys(data.planets));

      // Show Sun position as example
      if (data.planets.sun) {
        const sun = data.planets.sun;
        console.log('☉ Sun position:', {
          sign: sun.sign,
          degree: sun.degree,
          longitude: sun.longitude
        });
      }
    }

    // Check for points data (alternative structure)
    if (data.points) {
      console.log('🎯 Points found:', data.points.length);
      const sun = data.points.find(p => p.point === 'Sun' || p.body === 'Sun');
      if (sun) {
        console.log('☉ Sun from points:', sun);
      }
    }

    // Show full response for debugging
    console.log('\n📋 Full API Response:');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testAPI();