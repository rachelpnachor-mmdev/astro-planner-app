
// lib/astro/aspects.ts
import type { PointPosition } from './types';

export type AspectName = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
export type Aspect = { type: AspectName; p1: string; p2: string; angle: number; delta: number };

export const ASPECT_COLORS: Record<AspectName, string> = {
  conjunction: '#b9c7d9',
  sextile: '#4fb3ff',
  square: '#ff6b6b',
  trine: '#54d486',
  opposition: '#ffb347',
};

const DEF = [
  { type: 'conjunction', angle: 0,   orb: 8 },
  { type: 'sextile',     angle: 60,  orb: 4 },
  { type: 'square',      angle: 90,  orb: 6 },
  { type: 'trine',       angle: 120, orb: 6 },
  { type: 'opposition',  angle: 180, orb: 8 },
] as const;

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const sep = (a: number, b: number) => {
  const d = Math.abs(norm360(a) - norm360(b)) % 360;
  return d > 180 ? 360 - d : d;
};

export function computeAspects(points: PointPosition[]) {
  const longs = points.map(p => ({ name: p.point, lon: p.ecliptic.signIndex * 30 + p.ecliptic.degree }));
  const out: Aspect[] = [];
  for (let i = 0; i < longs.length; i++) {
    for (let j = i + 1; j < longs.length; j++) {
      const d = sep(longs[i].lon, longs[j].lon);
      for (const def of DEF) {
        const delta = Math.abs(d - def.angle);
        if (delta <= def.orb) out.push({ type: def.type, p1: longs[i].name, p2: longs[j].name, angle: def.angle, delta: +delta.toFixed(2) });
      }
    }
  }
  return out.sort((a, b) => a.delta - b.delta);
}
