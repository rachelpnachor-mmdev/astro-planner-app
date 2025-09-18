import type { AstrologySystem, HouseSystem } from '../types/settings';
export type Methodology = 'western' | 'vedic' | 'sidereal' | 'hellenistic';
export type ComputeMode = 'api' | 'local';

export type Entitlements = {
  westernEnabled: boolean;
  vedicEnabled: boolean;
  siderealEnabled: boolean;
  hellenisticEnabled: boolean;
};

// Canonical ecliptic payload used by renderers and providers
export interface EclipticCanonical {
  lonDeg: number;            // 0..360
  degInSign?: number;        // 0..30
  signIndexAries0?: number;  // 0..11
  [k: string]: any;
}

// If BirthChart already exists, only AUGMENT it (don’t redefine):
// Add these optional fields if they aren't present yet
declare global {
  interface BirthChart {
    settings?: {
      methodology?: Methodology;
      zodiac?: 'tropical' | 'sidereal';
      ayanamsa?: string | null;
      houseSystem?: string | null;
      provider?: string; // 'freeastrologyapi@v1' | 'local-engine@v1'
    };
    birth?: { date?: string; time?: string; tz?: string; lat?: number; lon?: number };
    meta?: { source?: string; computedAt?: number; [k: string]: any };
  }
}

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

export type Degree = {
  signIndex: number; // 0=Aries…11=Pisces
  degree: number;          // 0–29.999
  lonDeg?: number;         // 0..360 ecliptic longitude
  degInSign?: number;      // 0..30 degrees within sign
  signIndexAries0?: number;  // 0..11 sign index (Aries=0)
};

export type PointPosition = {
  point: ChartPoint;
  ecliptic: Degree;
};

export type Houses = {
  system: HouseSystem;
  cusps: Degree[]; // 12 entries
};

export type ChartSettings = {
  methodology: Methodology;
  zodiac?: 'tropical' | 'sidereal';
  houseSystem?: string;
  ayanamsa?: string | null;
};

export type BirthChart = {
  system: AstrologySystem;
  houses: Houses;
  points: PointPosition[];
  computedAt: number;
  settings?: {
    methodology?: Methodology;
    zodiac?: 'tropical' | 'sidereal';
    ayanamsa?: string | null;
    houseSystem?: string | null;
    provider?: string; // 'freeastrologyapi@v1' | 'local-engine@v1'
  };

  birth?: {
    date?: string;
    time?: string;
    tz?: string;
    lat?: number;
    lon?: number;
  };
  input?: {
    dateISO?: string;
  };
  meta?: {
    source?: string;
    [key: string]: any;
  };
};
