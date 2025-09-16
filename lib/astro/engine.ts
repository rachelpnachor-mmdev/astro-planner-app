// lib/astro/engine.ts
import type { Settings } from '../types/settings';
import type { BirthChart, BirthProfileInput, Degree, PointPosition } from './types';

// Utility: create a "fake but stable" degree from inputs so UI can render now.
// Replace this with real ephemeris math later.
function hashToDegree(seed: string, mod = 360): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % mod) + (h % 100) / 100; // add some decimals
}

function toSignDegree(totalDeg: number): Degree {
  const norm = ((totalDeg % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const degree = norm - signIndex * 30;
  return { signIndex, degree };
}

function fakePoint(name: string, seed: string): PointPosition {
  const deg = hashToDegree(name + '|' + seed);
  return { point: name as PointPosition['point'], ecliptic: toSignDegree(deg) };
}

export async function computeBirthChart(
  profile: BirthProfileInput,
  settings: Settings
): Promise<BirthChart> {
  const seed = `${profile.dateISO}|${profile.lat}|${profile.lon}|${settings.astrology.system}|${settings.astrology.houseSystem}`;

  // Fake 12 house cusps
  const ascDeg = hashToDegree('ASC|' + seed);
  const cusps = Array.from({ length: 12 }, (_, i) => toSignDegree(ascDeg + i * 30));

  // Fake points
  const points = [
    'Sun','Moon','Mercury','Venus','Mars',
    'Jupiter','Saturn','Uranus','Neptune','Pluto','ASC','MC',
  ].map(p => fakePoint(p, seed));

  return {
    system: settings.astrology.system,
    houses: { system: settings.astrology.houseSystem, cusps },
    points,
    computedAt: Date.now(),
  };
}
