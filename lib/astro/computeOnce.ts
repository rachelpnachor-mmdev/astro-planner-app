// lib/astro/computeOnce.ts
import type { BirthChart, ChartSettings } from './types';
import type { BirthProfile } from './useBirthChart';
import { computeBirthChartViaProviders } from './useBirthChart';
import { getLocationCoords } from '../constants/locations';

// Make sure the profile has strings where required
function normalizeProfile(p: Partial<BirthProfile> & { locationText?: string }): BirthProfile {
  console.log('[LUNARIA][profile] normalizing birth profile', p);

  let lat = typeof p.lat === 'number' ? p.lat : undefined;
  let lon = typeof p.lon === 'number' ? p.lon : undefined;
  let timezone = typeof p.timezone === 'string' ? p.timezone : 'UTC';

  // If we don't have coordinates but have locationText, try to resolve them
  if (!lat || !lon) {
    const locationText = (p as any).locationText || '';
    const coords = getLocationCoords(locationText);
    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
      timezone = coords.timezone; // Use timezone from location
      console.log('[LUNARIA][profile] resolved coordinates from', locationText, '→', coords);
    } else if (locationText) {
      console.warn('[LUNARIA][profile] could not resolve coordinates for', locationText);
    }
  }

  const normalized = {
    birthDate: String(p.birthDate || ''),            // required string
    birthTime: typeof p.birthTime === 'string' ? p.birthTime : '12:00',
    timezone,
    lat,
    lon,
  };

  console.log('[LUNARIA][profile] normalized birth profile', normalized);
  return normalized;
}

/**
 * Compute once and optionally persist.
 * Supply a persist callback that accepts a full BirthChart.
 */
export async function computeAndMaybePersist(
  profileLike: Partial<BirthProfile>,
  settings: ChartSettings,
  persist?: (chart: BirthChart) => Promise<void> | void
): Promise<BirthChart> {
  const profile = normalizeProfile(profileLike);
  const chart = await computeBirthChartViaProviders(profile, settings);
  if (persist) await persist(chart);
  return chart;
}
