// engine/apiProvider.ts
import { DateTime } from 'luxon';
import { normalizePointsToCanonical } from '../lib/astro/normalize';
import type { BirthChart, ChartSettings } from '../lib/astro/types';

export type BirthProfile = {
  birthDate: string;       // 'YYYY-MM-DD'
  birthTime?: string;      // 'HH:mm'
  timezone?: string;       // IANA tz (e.g., 'America/Los_Angeles')
  lat?: number;
  lon?: number;
};

// Default to the FreeAstrologyAPI western planets endpoint.
// You can override with EXPO_PUBLIC_FREE_ASTROLOGY_API_URL if needed.
const API_URL =
  process.env.EXPO_PUBLIC_FREE_ASTROLOGY_API_URL ??
  'https://json.freeastrologyapi.com/western/planets';

const API_KEY = process.env.EXPO_PUBLIC_FREE_ASTROLOGY_API_KEY;

/** Build numeric request payload exactly as the API expects. */
function buildRequestBody(profile: BirthProfile) {
  const dateISO = String(profile.birthDate || '').slice(0, 10) || '2000-01-01';
  const timeStr = typeof profile.birthTime === 'string' && profile.birthTime
    ? profile.birthTime
    : '12:00';
  const zone = profile.timezone || 'UTC';

  // Construct local DateTime at birthplace zone
  const local = DateTime.fromISO(`${dateISO}T${timeStr}`, { zone });
  // offset in minutes (e.g., -480 for PST) → float hours (e.g., -8)
  const tzFloat = (local.offset || 0) / 60;

  // Latitude/Longitude must be numbers; default to 0 if unknown.
  const latitude = Number.isFinite(profile.lat as any) ? Number(profile.lat) : 0;
  const longitude = Number.isFinite(profile.lon as any) ? Number(profile.lon) : 0;

  return {
    body: {
      year: local.year,               // number
      month: local.month,             // 1..12
      date: local.day,                // 1..31
      hours: local.hour,              // 0..23
      minutes: local.minute,          // 0..59
      seconds: local.second || 0,     // 0..59
      latitude,                       // number
      longitude,                      // number
      timezone: tzFloat,              // float hours, e.g. -8, 5.5
      config: {
        observation_point: 'topocentric',
        // For western tropical this is ignored, but safe to include.
        ayanamsha: 'lahiri',
        language: 'en',
      },
    },
    localISO: local.toISO(),
    offsetMinutes: local.offset || 0,
  };
}

export const apiProvider = {
  async compute(profile: BirthProfile, settings: ChartSettings): Promise<BirthChart> {
    if (!API_KEY) {
      console.warn('[apiProvider] missing EXPO_PUBLIC_FREE_ASTROLOGY_API_KEY – request will likely fail');
    }

    const { body, localISO, offsetMinutes } = buildRequestBody(profile);

    // Build headers with x-api-key (expected by this provider)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (API_KEY) headers['x-api-key'] = String(API_KEY);

    // Fire request
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      console.warn('[apiProvider] request failed', {
        status: res.status,
        url: API_URL,
        preview: msg.slice(0, 200),
      });
      throw new Error(`[apiProvider] ${res.status}  :: ${msg}`);
    }

    const raw = await res.json();

    // Providers may return different shapes; normalize defensively.
    const rawPoints =
      raw?.output ??           // FreeAstrologyAPI structure
      raw?.points ??
      raw?.planets ??
      raw?.data?.points ??
      raw?.data?.planets ??
      [];

    const points = normalizePointsToCanonical(rawPoints);

    const chart: BirthChart = {
      ...(raw || {}),
      points,
      system: (settings as any)?.methodology === 'western' ? 'western_tropical' : raw?.system,
      settings: {
        ...(raw?.settings || {}),
        methodology: settings.methodology,
        zodiac: 'tropical',
        houseSystem: settings.houseSystem ?? 'whole_sign',
        provider: 'freeastrologyapi@v1',
      },
      birth: {
        ...(raw?.birth || {}),
        date: profile.birthDate,
        time: profile.birthTime,
        tz: profile.timezone,
        lat: profile.lat,
        lon: profile.lon,
      },
      meta: {
        ...(raw?.meta || {}),
        source: 'api',
        computedAt: Date.now(),
        localISO,
        offsetMinutes,
      },
    } as BirthChart;

    return chart;
  },
};
