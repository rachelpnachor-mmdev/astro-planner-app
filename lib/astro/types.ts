// lib/astro/types.ts
import type { AstrologySystem, HouseSystem } from '../types/settings';

export type BirthProfileInput = {
  dateISO: string;        // e.g., '2012-11-05T23:57:00-06:00'
  tzOffsetMinutes: number; // e.g., -360 for CST
  lat: number;            // +N
  lon: number;            // +E (west is negative)
  // add fields as needed; keep minimal for now
};

export type ChartPoint =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'ASC' | 'MC';

export type Degree = { signIndex: number; // 0=Aries…11=Pisces
  degree: number;          // 0–29.999
};

export type PointPosition = {
  point: ChartPoint;
  ecliptic: Degree;
};

export type Houses = {
  system: HouseSystem;
  cusps: Degree[]; // 12 entries
};

export type BirthChart = {
  system: AstrologySystem;
  houses: Houses;
  points: PointPosition[];
  computedAt: number;
};
