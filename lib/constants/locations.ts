// lib/constants/locations.ts
// Map of city names to coordinates for birth chart calculations

export interface LocationCoords {
  lat: number;
  lon: number;
  timezone: string;
}

export const LOCATION_MAP: Record<string, LocationCoords> = {
  // USA Major Cities
  "Boulder, CO, USA": { lat: 40.0150, lon: -105.2705, timezone: "America/Denver" },
  "New York, NY, USA": { lat: 40.7128, lon: -74.0060, timezone: "America/New_York" },
  "Los Angeles, CA, USA": { lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles" },
  "Chicago, IL, USA": { lat: 41.8781, lon: -87.6298, timezone: "America/Chicago" },
  "Houston, TX, USA": { lat: 29.7604, lon: -95.3698, timezone: "America/Chicago" },
  "Phoenix, AZ, USA": { lat: 33.4484, lon: -112.0740, timezone: "America/Phoenix" },
  "Philadelphia, PA, USA": { lat: 39.9526, lon: -75.1652, timezone: "America/New_York" },
  "San Antonio, TX, USA": { lat: 29.4241, lon: -98.4936, timezone: "America/Chicago" },
  "San Diego, CA, USA": { lat: 32.7157, lon: -117.1611, timezone: "America/Los_Angeles" },
  "Dallas, TX, USA": { lat: 32.7767, lon: -96.7970, timezone: "America/Chicago" },
  "San Jose, CA, USA": { lat: 37.3382, lon: -121.8863, timezone: "America/Los_Angeles" },
  "Austin, TX, USA": { lat: 30.2672, lon: -97.7431, timezone: "America/Chicago" },
  "San Francisco, CA, USA": { lat: 37.7749, lon: -122.4194, timezone: "America/Los_Angeles" },
  "Seattle, WA, USA": { lat: 47.6062, lon: -122.3321, timezone: "America/Los_Angeles" },
  "Denver, CO, USA": { lat: 39.7392, lon: -104.9903, timezone: "America/Denver" },
  "Washington, DC, USA": { lat: 38.9072, lon: -77.0369, timezone: "America/New_York" },
  "Boston, MA, USA": { lat: 42.3601, lon: -71.0589, timezone: "America/New_York" },
  "Las Vegas, NV, USA": { lat: 36.1699, lon: -115.1398, timezone: "America/Los_Angeles" },
  "Portland, OR, USA": { lat: 45.5152, lon: -122.6784, timezone: "America/Los_Angeles" },
  "Atlanta, GA, USA": { lat: 33.7490, lon: -84.3880, timezone: "America/New_York" },
  "Miami, FL, USA": { lat: 25.7617, lon: -80.1918, timezone: "America/New_York" },
  "Minneapolis, MN, USA": { lat: 44.9778, lon: -93.2650, timezone: "America/Chicago" },
  "Tampa, FL, USA": { lat: 27.9506, lon: -82.4572, timezone: "America/New_York" },
  "Orlando, FL, USA": { lat: 28.5383, lon: -81.3792, timezone: "America/New_York" },
  "Salt Lake City, UT, USA": { lat: 40.7608, lon: -111.8910, timezone: "America/Denver" },

  // International Cities
  "London, UK": { lat: 51.5074, lon: -0.1278, timezone: "Europe/London" },
  "Paris, France": { lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris" },
  "Berlin, Germany": { lat: 52.5200, lon: 13.4050, timezone: "Europe/Berlin" },
  "Tokyo, Japan": { lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo" },
  "Sydney, Australia": { lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney" },
  "Toronto, ON, Canada": { lat: 43.6532, lon: -79.3832, timezone: "America/Toronto" },
  "Vancouver, BC, Canada": { lat: 49.2827, lon: -123.1207, timezone: "America/Vancouver" },
  "Mexico City, Mexico": { lat: 19.4326, lon: -99.1332, timezone: "America/Mexico_City" },
  "São Paulo, Brazil": { lat: -23.5505, lon: -46.6333, timezone: "America/Sao_Paulo" },
  "Buenos Aires, Argentina": { lat: -34.6118, lon: -58.3960, timezone: "America/Argentina/Buenos_Aires" },
  "Rome, Italy": { lat: 41.9028, lon: 12.4964, timezone: "Europe/Rome" },
  "Madrid, Spain": { lat: 40.4168, lon: -3.7038, timezone: "Europe/Madrid" },
  "Barcelona, Spain": { lat: 41.3851, lon: 2.1734, timezone: "Europe/Madrid" },
  "Amsterdam, Netherlands": { lat: 52.3676, lon: 4.9041, timezone: "Europe/Amsterdam" },
  "Dublin, Ireland": { lat: 53.3498, lon: -6.2603, timezone: "Europe/Dublin" },
  "Edinburgh, UK": { lat: 55.9533, lon: -3.1883, timezone: "Europe/London" },
  "Zurich, Switzerland": { lat: 47.3769, lon: 8.5417, timezone: "Europe/Zurich" },
  "Vienna, Austria": { lat: 48.2082, lon: 16.3738, timezone: "Europe/Vienna" },
  "Copenhagen, Denmark": { lat: 55.6761, lon: 12.5683, timezone: "Europe/Copenhagen" },
  "Stockholm, Sweden": { lat: 59.3293, lon: 18.0686, timezone: "Europe/Stockholm" },
  "Oslo, Norway": { lat: 59.9139, lon: 10.7522, timezone: "Europe/Oslo" },
  "Helsinki, Finland": { lat: 60.1699, lon: 24.9384, timezone: "Europe/Helsinki" },
  "Brussels, Belgium": { lat: 50.8503, lon: 4.3517, timezone: "Europe/Brussels" },
  "Prague, Czech Republic": { lat: 50.0755, lon: 14.4378, timezone: "Europe/Prague" },
  "Warsaw, Poland": { lat: 52.2297, lon: 21.0122, timezone: "Europe/Warsaw" },
  "Budapest, Hungary": { lat: 47.4979, lon: 19.0402, timezone: "Europe/Budapest" },
  "Athens, Greece": { lat: 37.9755, lon: 23.7348, timezone: "Europe/Athens" },
};

export function getLocationCoords(locationText: string): LocationCoords | null {
  return LOCATION_MAP[locationText] || null;
}

export function getAvailableLocations(): string[] {
  return Object.keys(LOCATION_MAP).sort();
}