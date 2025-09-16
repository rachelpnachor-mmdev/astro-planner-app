
// lib/astro/aspects.ts

// Canonical aspect types
// Deprecated API wrapper for compatibility (PointPosition[])
import type { PointPosition } from './types';

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';
export const ASPECT_TARGET: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
  quincunx: 150,
};
export const ASPECT_COLORS: Record<AspectType, string> = {
  conjunction: '#FFCC00',
  sextile: '#00C78B',
  square: '#FF4D4D',
  trine: '#4DA6FF',
  opposition: '#FF8A00',
  quincunx: '#AA88FF',
};
const BASE_ORB: Record<AspectType, number> = {
  conjunction: 8,
  sextile: 4,
  square: 6,
  trine: 6,
  opposition: 8,
  quincunx: 3,
};
const isLum = (id: string) => id === 'Sun' || id === 'Moon';
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
function orbForPair(t: AspectType, aId: string, bId: string) {
  let orb = BASE_ORB[t];
  if (isLum(aId) || isLum(bId)) orb = Math.min(9, orb + 2);
  return orb;
}
function sep(a: number, b: number) {
  return Math.abs(((b - a + 540) % 360) - 180); // [0,180]
}
export type Body = { id: string; lon: number };
export type AspectEdge = {
  a: string; b: string; type: AspectType;
  delta: number; miss: number; exactness: number;
};

// Deterministic, conventional aspect logic
export function computeAspects(
  bodies: Body[],
  enabled: AspectType[] = ['conjunction','sextile','square','trine','opposition']
): AspectEdge[] {
  const out: AspectEdge[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const A = bodies[i], B = bodies[j];
      const d = sep(A.lon, B.lon);
      // find closest aspect
      let bestType: AspectType | null = null;
      let bestMiss = Infinity;
      for (const t of enabled) {
        const miss = Math.abs(d - ASPECT_TARGET[t]);
        if (miss < bestMiss) { bestMiss = miss; bestType = t; }
      }
      if (!bestType) continue;
      const orb = orbForPair(bestType, A.id, B.id);
      if (bestMiss <= orb) {
        const exactness = clamp01(1 - bestMiss / orb);
        out.push({ a: A.id, b: B.id, type: bestType, delta: d, miss: bestMiss, exactness });
      }
    }
  }
  return out;
}
export type Aspect = { type: AspectType; p1: string; p2: string; angle: number; delta: number };
export function computeAspectsLegacy(points: PointPosition[]): Aspect[] {
  // Map PointPosition to Body
  const bodies: Body[] = points.map(p => ({
    id: p.point,
    lon: p.ecliptic.signIndex * 30 + p.ecliptic.degree,
  }));
  // Use canonical aspects (no quincunx)
  const edges = computeAspects(bodies);
  // Convert to legacy Aspect format
  return edges.map(e => ({
    type: e.type,
    p1: e.a,
    p2: e.b,
    angle: ASPECT_TARGET[e.type],
    delta: +e.miss.toFixed(2),
  }));
}
