// lib/astro/engine.ts
// Temporary, dependency-free engine that returns deterministic positions
// so the UI (wheel/table/aspects) renders without astronomy libraries.

import type { Settings } from '../types/settings';
import type { BirthChart, BirthProfileInput, Degree, PointPosition } from './types';

// Points we draw in the chart/table
const POINT_KEYS: PointPosition['point'][] = [
  'Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto',
];

// Fixed per-planet base offsets (degrees)
const BASE_OFFSET: Record<string, number> = {
  Sun: 225,  // ~Scorpio-ish for common demo
  Moon: 120,
  Mercury: 245,
  Venus: 275,
  Mars: 315,
  Jupiter: 60,
  Saturn: 90,
  Uranus: 180,
  Neptune: 330,
  Pluto: 15,
};

function norm360(x: number) {
  const n = x % 360;
  return n < 0 ? n + 360 : n;
}

function toSignDegree(lonDeg: number): Degree {
  const lon = norm360(lonDeg);
  const signIndex = Math.floor(lon / 30);
  const degree = lon - signIndex * 30;
  return { signIndex, degree };
}

function hashStr(s: string): number {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seedFromProfile(profile: BirthProfileInput): number {
  const key = `${profile.dateISO || ''}|${profile.lat ?? ''}|${profile.lon ?? ''}|${profile.tzOffsetMinutes ?? ''}`;
  return hashStr(key || 'lunaria') % 100000;
}

export async function computeBirthChart(
  profile: BirthProfileInput,
  settings: Settings
): Promise<BirthChart> {
  // Derive a deterministic “time factor” so the chart changes with date/time.
  const dateMs = Date.parse(profile.dateISO ?? '') || 0;
  const d = dateMs ? new Date(dateMs) : new Date(1986, 10, 21, 11, 0, 0); // harmless default
  const doy = Math.floor(((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86400000));
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();

  const seed = seedFromProfile(profile);
  const dayFactor = (doy % 360);
  const timeFactor = (minutes % 360);
  const jitter = (seed % 29); // small 0..28° spread to avoid identical charts

  const points: PointPosition[] = POINT_KEYS.map((key, idx) => {
    const base = BASE_OFFSET[key] ?? (idx * 33); // fall back offset if key missing
    // Combine base + day/time + tiny jitter, wrap into 0..360
    const lon = norm360(base + dayFactor * 0.9 + timeFactor * 0.25 + jitter);
    return { point: key as PointPosition['point'], ecliptic: toSignDegree(lon) };
  });

  // Placeholder whole-sign cusps (Aries 0°, Taurus 0°, ...)
  const cusps: Degree[] = Array.from({ length: 12 }, (_, i) => ({ signIndex: i, degree: 0 }));

  return {
    system: settings.astrology.system,
    houses: { system: settings.astrology.houseSystem, cusps },
    points,
    computedAt: Date.now(),
  };
}
