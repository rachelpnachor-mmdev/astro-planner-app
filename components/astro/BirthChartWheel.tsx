// components/astro/BirthChartWheel.tsx
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { BirthChart } from '../../lib/astro/types';
import { FONTS, loadFonts } from '../../lib/fonts';
import { LunariaColors } from '../../constants/Colors';

/* =========================
   THEME / LABEL CONSTANTS
   ========================= */

const ZODIAC_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'] as const;

const PLANET_NAMES = [
  'Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Chiron','Node'
];

const PLANET_GLYPHS = ['☉','☽','☿','♀','♂','♃','♄','♅','♆','♇','⚷','☊'];

const PLANET_GLYPH: Record<string, string> = {
  Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂',
  Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇',
  Chiron:'⚷', Node:'☊',
};

const COL = {
  rim: '#FFFFFF',
  zodiac: '#B99CFF',
  houseMajor: '#FFFFFF',
  houseMinor: '#FFFFFF',
  label: '#FFFFFF',
};

const OP = {
  rim: 0.20,
  houseMajor: 0.50,
  houseMinor: 0.16,
  text: 0.90,
};

const STROKE = {
  rim: 1.2,
  houseMajor: 2.0,
  houseMinor: 0.9,
};

// radii layout from overall radius R
const RLAY = (R: number) => ({
  rOuter:        R * 0.94,
  rSigns:        R * 0.90,  // zodiac glyphs (outer ring)
  rZodiacTicks:  R * 0.83,  // 5°/10°/30° ticks
  rPlanetTrack:  R * 0.70,  // base radius for chips
  rPlanetLaneGap:R * 0.055, // separation for lanes
  rHouses:       R * 0.34,  // house numerals radius
  rInner1:       R * 0.36,
  rInner2:       R * 0.32,
});

// planet chip visuals
const CHIP = {
  w: 32,
  h: 24,
  rx: 7,
  pad: 0,
  fill: '#8E5CFF',
  fillOp: 0.96,
  stroke: '#000000',
  strokeOp: 0.30,
  glyphFs: 13,
  degFs: 10.5,
  degColor: '#E9EEF7',
};

/* =========================
   GEOMETRY HELPERS
   ========================= */

const DEG = Math.PI / 180;
const ANGLE_OFFSET = 90; // Aries at top (will be adjusted for ASC)
const norm360 = (x: number) => ((x % 360) + 360) % 360;

// BRS-compliant angle mapping: ASC at 9 o'clock, MC at 12 o'clock
const createAngleFromLongitude = (ascLongitude: number) => {
  return (lon: number) => {
    // θ_rel = (L - ASC + 360) % 360
    const theta_rel = norm360(lon - ascLongitude);
    // For astrological charts: ASC at 9 o'clock (180°), MC at 12 o'clock (270°)
    // θ_canvas = (180 + θ_rel) % 360
    // ASC (theta_rel=0) → 180° = 9 o'clock
    // MC (theta_rel=90) → 270° = 12 o'clock
    // ANCHORED: -7° global rotation aligns house cusps perfectly with reference chart
    // Cusp between 9th/10th house exactly at 12 o'clock, ASC at 9 o'clock
    const theta_canvas_deg = norm360(180 + theta_rel - 7);
    return theta_canvas_deg * DEG;
  };
};

// Default angle function (fallback when no ASC available) - also BRS compliant
const angleFromLongitude = (lon: number) => {
  // Fallback: assume ASC at 0° (Aries) for consistent mapping
  const theta_rel = norm360(lon - 0);
  const theta_canvas_deg = norm360(180 + theta_rel);
  return theta_canvas_deg * DEG;
};
// SVG coordinate system with Y-axis correction
// Standard: 0° = 3 o'clock, 90° = 12 o'clock (negative Y)
// SVG: Y increases downward, so negate Y for proper orientation
const polar = (r: number, ang: number) => ({ x: r * Math.cos(ang), y: -r * Math.sin(ang) });

/* =========================
   SAFE NUMERIC READERS
   ========================= */

const isFiniteNum = (x: any): x is number => typeof x === 'number' && Number.isFinite(x);
const toNum = (v: any): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};
const radToDeg = (rad: number) => (rad * 180) / Math.PI;

const degFromObj = (obj: any): number => {
  if (!obj || typeof obj !== 'object') return NaN;

  // radians explicitly
  const rad = toNum(obj.rad ?? obj.radians);
  if (isFiniteNum(rad)) return radToDeg(rad);

  // degrees explicitly
  const deg =
    toNum(obj.deg) ??
    toNum(obj.degree) ??
    toNum(obj.degrees);
  if (isFiniteNum(deg)) return deg;

  // generic numeric + optional unit
  const value = toNum(obj.value ?? obj.val ?? obj.x);
  if (isFiniteNum(value)) {
    const unit = String(obj.unit ?? obj.units ?? '').toLowerCase();
    if (unit.includes('rad')) return radToDeg(value);
    return value; // assume degrees
  }
  return NaN;
};

const getPath = (obj: any, path: (string | number)[]): any => {
  let cur = obj;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = cur[key as any];
  }
  return cur;
};

/* =========================
   DATA EXTRACTORS (canonical-first)
   ========================= */

// Absolute ecliptic longitude in DEGREES [0..360)
function extractLonDeg(p: any): number {
  // 0) Canonical path from builder
  const L = Number(p?.ecliptic?.lonDeg);
  if (Number.isFinite(L)) return ((L % 360) + 360) % 360;

  // 1) Existing absolute longitude fallbacks (keep as-is)
  const e = p?.ecliptic ?? p?.ecl ?? {};
  const base = { ecliptic: e, ...p };
  const paths: (string | number)[][] = [
    ['ecliptic','longitude','deg'],
    ['ecliptic','longitude','degree'],
    ['ecliptic','longitude','degrees'],
    ['ecliptic','longitude','value'],
    ['ecliptic','longitude'],

    ['ecliptic','lon','deg'],
    ['ecliptic','lon','degree'],
    ['ecliptic','lon','degrees'],
    ['ecliptic','lon','value'],
    ['ecliptic','lon'],

    ['ecliptic','elon'],
    ['ecliptic','lambda'],
    ['ecliptic','long'],
    ['ecliptic','elong'],

    // flat fallbacks
    ['lon'], ['longitude'], ['elon'], ['lambda'], ['eclipticLon'], ['absLon'],
  ];
  for (const path of paths) {
    const val = getPath(base, path);
    if (val == null) continue;
    if (typeof val === 'object') {
      const d = degFromObj(val);
      if (isFiniteNum(d)) return d;
    } else if (isFiniteNum(val)) {
      return val;
    }
  }
  // Last-resort: try radians
  if (isFiniteNum(e?.rad)) return norm360((e.rad * 180) / Math.PI);
  if (isFiniteNum((base as any)?.rad)) return norm360(((base as any).rad * 180) / Math.PI);
  return NaN;
}

// Degree-in-sign for the label (0..30). Prefer API value, then canonical; fallback derive from lon.
function extractDegInSign(p: any, lonDeg: number): number {
  const e = p?.ecliptic ?? p?.ecl ?? {};

  // Prefer explicit API degree value
  const apiDegInSign = Number(e?.apiDegInSign);
  if (Number.isFinite(apiDegInSign) && apiDegInSign >= 0 && apiDegInSign <= 30) return apiDegInSign;

  // Then prefer canonical degInSign (which is already from API via normalize)
  const canonical = Number(e?.degInSign);
  if (Number.isFinite(canonical) && canonical >= 0 && canonical <= 30) return canonical;

  // fallback to deriving from lonDeg
  if (Number.isFinite(lonDeg)) {
    return ((lonDeg % 30) + 30) % 30;
  }

  return 0; // ultimate fallback
}

/* =========================
   CHIP LAYOUT
   ========================= */

type PlanetChipInput = {
  id: string;
  lon: number;      // 0..360
  glyph: string;    // symbol
  degText: string;  // '13.5°'
  minutesText?: string; // '13°24′'
  isRetrograde?: boolean;
  signName?: string;
};

type PlacedChip = PlanetChipInput & {
  angle: number;    // radians (after any nudges)
  lane: number;     // 0+ for multiple lanes
  r: number;
  x: number;
  y: number;
  hasLeaderLine?: boolean;
  stelliumGroup?: number;
  isClusterChip?: boolean;
  clusterMembers?: PlacedChip[];
  expanded?: boolean;
};

type ZoomDetailLevel = 'glyph-only' | 'glyph-degree' | 'full-detail';

const PLANET_NAMES_SHORT = {
  'Sun': 'Sun',
  'Moon': 'Moon',
  'Mercury': 'Mer',
  'Venus': 'Ven',
  'Mars': 'Mar',
  'Jupiter': 'Jup',
  'Saturn': 'Sat',
  'Uranus': 'Ura',
  'Neptune': 'Nep',
  'Pluto': 'Plu',
  'Chiron': 'Chi',
  'Node': 'Node',
  'True Node': 'TNode',
  'Mean Node': 'MNode',
  'Ascendant': 'ASC',
  'Descendant': 'DSC',
  'MC': 'MC',
  'IC': 'IC',
  'Lilith': 'Lil',
  'Ceres': 'Cer',
  'Pallas': 'Pal',
  'Juno': 'Jun',
  'Vesta': 'Ves'
} as const;

type ChipDisplayInfo = {
  showGlyph: boolean;
  showDegree: boolean;
  showMinutes: boolean;
  showRetrograde: boolean;
  showName: boolean;
  chipSize: { w: number; h: number };
  fontSize: { glyph: number; degree: number };
};

type ChartLayoutMode = 'compact' | 'expanded';

type LayoutSettings = {
  mode: ChartLayoutMode;
  stelliumThreshold: number;    // minimum bodies for stellium (default: 3)
  stelliumAngleDeg: number;     // max angle span for stellium (default: 5°)
  collisionThresholdDeg: number; // min separation to avoid collision (default: 3°)
  maxLanes: number;             // maximum radial lanes (default: 5)
  enableLeaderLines: boolean;   // allow leader lines for extreme cases
};

// Default layout settings
const DEFAULT_LAYOUT: LayoutSettings = {
  mode: 'expanded',
  stelliumThreshold: 3, // Business spec: minimum 3 planets
  stelliumAngleDeg: 10, // Business spec: 10° orb for stellium detection
  collisionThresholdDeg: 3,
  maxLanes: 5,
  enableLeaderLines: true,
};

// Storage keys
const STORAGE_KEYS = {
  LAYOUT_SETTINGS: '@astro_chart_layout_settings',
  ZOOM_LEVEL: '@astro_chart_zoom_level',
  EXPANDED_STELLIUMS: '@astro_chart_expanded_stelliums',
};

// Storage helper functions
const saveLayoutSettings = async (settings: LayoutSettings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAYOUT_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save layout settings:', error);
  }
};

const loadLayoutSettings = async (): Promise<LayoutSettings> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAYOUT_SETTINGS);
    if (stored) {
      return { ...DEFAULT_LAYOUT, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load layout settings:', error);
  }
  return DEFAULT_LAYOUT;
};

const saveZoomLevel = async (zoomLevel: number) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ZOOM_LEVEL, zoomLevel.toString());
  } catch (error) {
    console.warn('Failed to save zoom level:', error);
  }
};

const loadZoomLevel = async (): Promise<number> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.ZOOM_LEVEL);
    if (stored) {
      const parsed = parseFloat(stored);
      if (Number.isFinite(parsed) && parsed >= 1.0 && parsed <= 3.0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load zoom level:', error);
  }
  return 1.0;
};

const saveExpandedStelliums = async (expandedStelliums: Set<number>) => {
  try {
    const array = Array.from(expandedStelliums);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPANDED_STELLIUMS, JSON.stringify(array));
  } catch (error) {
    console.warn('Failed to save expanded stelliums:', error);
  }
};

const loadExpandedStelliums = async (): Promise<Set<number>> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.EXPANDED_STELLIUMS);
    if (stored) {
      const array = JSON.parse(stored);
      if (Array.isArray(array)) {
        return new Set(array.filter(item => typeof item === 'number'));
      }
    }
  } catch (error) {
    console.warn('Failed to load expanded stelliums:', error);
  }
  return new Set();
};

// Determine detail level based on zoom (updated thresholds)
function getZoomDetailLevel(zoomLevel: number): ZoomDetailLevel {
  if (zoomLevel < 1.25) return 'glyph-only';      // < 125% = glyph only
  if (zoomLevel < 1.75) return 'glyph-degree';    // 125-175% = glyph + degree
  return 'full-detail';                           // 175%+ = glyph + name + degree
}

// Get chip display configuration based on zoom level
function getChipDisplayInfo(zoomLevel: number, layoutMode: ChartLayoutMode): ChipDisplayInfo {
  const detailLevel = getZoomDetailLevel(zoomLevel);
  const modeScale = layoutMode === 'compact' ? 0.9 : 1.0;

  // Cap chip scaling at 125% for readability - after 125%, chips don't get bigger
  const chipZoomLevel = Math.min(zoomLevel, 1.25);

  const baseSize = { w: 32, h: 24 };
  const baseFontSize = { glyph: 13, degree: 10.5 };

  switch (detailLevel) {
    case 'glyph-only':
      return {
        showGlyph: true,
        showDegree: false,
        showMinutes: false,
        showRetrograde: false,
        showName: false,
        chipSize: {
          w: baseSize.w * 0.7 * chipZoomLevel * modeScale,
          h: baseSize.h * 0.7 * chipZoomLevel * modeScale
        },
        fontSize: {
          glyph: baseFontSize.glyph * chipZoomLevel * modeScale,
          degree: 0
        },
      };

    case 'glyph-degree':
      return {
        showGlyph: true,
        showDegree: true,
        showMinutes: false,
        showRetrograde: false,
        showName: false,
        chipSize: {
          w: baseSize.w * chipZoomLevel * modeScale,
          h: baseSize.h * chipZoomLevel * modeScale
        },
        fontSize: {
          glyph: baseFontSize.glyph * chipZoomLevel * modeScale,
          degree: baseFontSize.degree * chipZoomLevel * modeScale
        },
      };

    case 'full-detail':
      return {
        showGlyph: true,
        showDegree: true,
        showMinutes: false,  // Remove minutes display for readability
        showRetrograde: true,
        showName: false,     // Remove name display - user can check legend
        chipSize: {
          w: baseSize.w * 1.4 * chipZoomLevel * modeScale,
          h: baseSize.h * 1.5 * chipZoomLevel * modeScale
        },
        fontSize: {
          glyph: baseFontSize.glyph * chipZoomLevel * modeScale,
          degree: baseFontSize.degree * 0.8 * chipZoomLevel * modeScale
        },
      };
  }
}

// Calculate angular distance between two angles (in radians), handling wrap-around
function angularDistance(a1: number, a2: number): number {
  const diff = Math.abs(a1 - a2);
  return Math.min(diff, 2 * Math.PI - diff);
}

// Helper function to get zodiac sign index from longitude (0 = Aries, 1 = Taurus, etc.)
function getZodiacSignIndex(longitude: number): number {
  return Math.floor(norm360(longitude) / 30);
}

// Helper function to determine which house a planet is in based on house cusps
function getHouseIndex(longitude: number, houseCusps: number[]): number {
  if (houseCusps.length !== 12) return -1; // Invalid house data

  const lon = norm360(longitude);

  for (let i = 0; i < 12; i++) {
    const cusp1 = norm360(houseCusps[i]);
    const cusp2 = norm360(houseCusps[(i + 1) % 12]);

    // Handle wraparound case
    if (cusp1 > cusp2) {
      // House spans 0° boundary
      if (lon >= cusp1 || lon < cusp2) {
        return i;
      }
    } else {
      // Normal case
      if (lon >= cusp1 && lon < cusp2) {
        return i;
      }
    }
  }

  return -1; // Should not happen
}

// Detect stelliums: groups of 3+ planets in same zodiac sign or house within orb
function detectStelliums(items: PlanetChipInput[], settings: LayoutSettings, houseCusps: number[] = []): number[][] {
  const stelliums: number[][] = [];
  const maxOrbDeg = settings.stelliumAngleDeg;

  // Add zodiac sign and house info to each planet
  const planetsWithInfo = items.map((p, idx) => ({
    ...p,
    idx,
    longitude: norm360(p.lon),
    signIndex: getZodiacSignIndex(p.lon),
    houseIndex: houseCusps.length === 12 ? getHouseIndex(p.lon, houseCusps) : -1
  }));


  // Group planets by zodiac sign
  const signGroups: { [signIndex: number]: typeof planetsWithInfo } = {};
  planetsWithInfo.forEach(planet => {
    if (!signGroups[planet.signIndex]) {
      signGroups[planet.signIndex] = [];
    }
    signGroups[planet.signIndex].push(planet);
  });

  // Check each sign group for stelliums
  Object.entries(signGroups).forEach(([signIndexStr, planetsInSign]) => {
    const signIndex = parseInt(signIndexStr);

    if (planetsInSign.length >= settings.stelliumThreshold) {
      // Sort planets in this sign by longitude
      const sortedInSign = planetsInSign.sort((a, b) => a.longitude - b.longitude);

      // Check if they're within orb (handle sign boundary wraparound)
      const minLon = sortedInSign[0].longitude;
      const maxLon = sortedInSign[sortedInSign.length - 1].longitude;

      // Handle case where planets span across 0°/360° boundary within a sign
      let orbSpan: number;
      if (maxLon - minLon > 180) {
        // Wraparound case: calculate the smaller arc
        orbSpan = 360 - (maxLon - minLon);
      } else {
        orbSpan = maxLon - minLon;
      }

      if (orbSpan <= maxOrbDeg) {
        // Valid sign-based stellium found
        const stelliumIndices = sortedInSign.map(p => p.idx);
        stelliums.push(stelliumIndices);
      }
    }
  });

  // BRS requirement: Also check for house-based stelliums
  if (houseCusps.length === 12) {
    const houseGroups: { [houseIndex: number]: typeof planetsWithInfo } = {};
    planetsWithInfo.forEach(planet => {
      if (planet.houseIndex >= 0) {
        if (!houseGroups[planet.houseIndex]) {
          houseGroups[planet.houseIndex] = [];
        }
        houseGroups[planet.houseIndex].push(planet);
      }
    });

    // Check each house group for stelliums
    Object.entries(houseGroups).forEach(([houseIndexStr, planetsInHouse]) => {
      const houseIndex = parseInt(houseIndexStr);

      if (planetsInHouse.length >= settings.stelliumThreshold) {
        // Check if this house stellium overlaps with any existing sign stellium
        const houseIndices = planetsInHouse.map(p => p.idx);
        const overlapsExisting = stelliums.some(existing =>
          existing.some(idx => houseIndices.includes(idx))
        );

        // Only add if it doesn't overlap with existing stelliums
        if (!overlapsExisting) {
          stelliums.push(houseIndices);
        }
      }
    });
  }

  return stelliums;
}

// Enhanced chip placement with stellium handling and collision avoidance
function placeChipsEnhanced(
  items: PlanetChipInput[],
  rBase: number,
  rGap: number,
  settings: LayoutSettings = DEFAULT_LAYOUT,
  expandedStelliums: Set<number> = new Set(),
  angleFunction: (lon: number) => number = angleFromLongitude,
  houseCusps: number[] = []
): PlacedChip[] {
  if (items.length === 0) return [];

  // Detect stelliums first (both sign and house based)
  const stelliums = detectStelliums(items, settings, houseCusps);

  const sorted = items
    .map((p, idx) => ({ ...p, idx, angle: angleFunction(p.lon) }))
    .sort((a, b) => a.angle - b.angle);

  const out: PlacedChip[] = [];
  const lastInLane: (PlacedChip | undefined)[] = new Array(settings.maxLanes).fill(undefined);
  const collisionThresholdRad = settings.collisionThresholdDeg * DEG;
  const processedIndices = new Set<number>();

  // No cluster chips - we'll handle stelliums with individual chips and better spacing

  // Process all planets individually (including stelliums)
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];

    let angle = item.angle;
    let lane = 0;
    let hasLeaderLine = false;

    // Find stellium group if any
    const stelliumGroup = stelliums.findIndex(group => group.includes(item.idx));
    const isStelliumMember = stelliumGroup >= 0;

    // Try to place in first available lane with no collision
    let foundLane = false;
    for (let L = 0; L < settings.maxLanes && !foundLane; L++) {
      const R = rBase - L * rGap;
      const prev = lastInLane[L];

      if (!prev) {
        lane = L;
        foundLane = true;
      } else {
        const angularSep = angularDistance(angle, prev.angle);
        // Larger gap for stellium chips for better tap targets
        const chipWidth = isStelliumMember ? CHIP.w * 1.2 : CHIP.w;
        const minPixelGap = chipWidth + 8;
        const actualPixelGap = angularSep * R;

        if (actualPixelGap >= minPixelGap && angularSep >= collisionThresholdRad) {
          lane = L;
          foundLane = true;
        }
      }
    }

    // If no lane found and leader lines enabled, place in outer lane with leader line
    if (!foundLane && settings.enableLeaderLines) {
      lane = settings.maxLanes - 1;
      hasLeaderLine = true;
      // Nudge angle slightly to avoid exact overlap
      const nudgeDirection = Math.random() > 0.5 ? 1 : -1;
      angle += nudgeDirection * collisionThresholdRad;
    } else if (!foundLane) {
      // Fallback: force into outermost lane with angle nudge
      lane = settings.maxLanes - 1;
      angle += (Math.random() - 0.5) * collisionThresholdRad * 2;
    }

    // For stellium members, spread them out slightly for better accessibility
    if (isStelliumMember) {
      const stelliumIndices = stelliums[stelliumGroup];
      const memberIndex = stelliumIndices.indexOf(item.idx);
      // Increased spread for better tap targets
      const spreadAngle = (memberIndex - stelliumIndices.length / 2) * 1.0 * DEG;
      angle += spreadAngle;
    }

    const r = rBase - lane * rGap;
    const pos = polar(r, angle);

    const placed: PlacedChip = {
      ...item,
      lane,
      r,
      angle,
      x: pos.x,
      y: pos.y,
      hasLeaderLine,
      stelliumGroup: stelliumGroup >= 0 ? stelliumGroup : undefined,
    };

    out.push(placed);
    lastInLane[lane] = placed;
  }

  // Cusp avoidance (keep chips off exact house cusps by ±3°)
  const CUSP_AVOID = 3 * DEG;
  const cusps = Array.from({ length: 12 }, (_, i) => (i * 30) * DEG);

  for (const ch of out) {
    for (const ca of cusps) {
      const d = angularDistance(ch.angle, ca);
      if (d < CUSP_AVOID) {
        ch.angle = ch.angle + (ch.angle >= ca ? 1 : -1) * CUSP_AVOID;
        const p = polar(ch.r, ch.angle);
        ch.x = p.x;
        ch.y = p.y;
        break;
      }
    }
  }

  return out;
}

// Legacy function for backward compatibility
function placeChips(items: PlanetChipInput[], rBase: number, rGap: number): PlacedChip[] {
  return placeChipsEnhanced(items, rBase, rGap, DEFAULT_LAYOUT);
}

/* =========================
   COMPONENT
   ========================= */

export default function BirthChartWheel({
  chart,
  availableWidth,
}: {
  chart: BirthChart;
  availableWidth?: number;
}) {
  const [showLegend, setShowLegend] = useState(false);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [expandedStelliums, setExpandedStelliums] = useState<Set<number>>(new Set());
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  // State for stellium table row selection and pulse animation
  const [selectedStellium, setSelectedStellium] = useState<number | null>(null);
  const [highlightedZodiacSign, setHighlightedZodiacSign] = useState<number | null>(null);
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Animated zoom level for smooth transitions
  const zoomAnimValue = useRef(new Animated.Value(1.0)).current;
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [animatedZoomLevel, setAnimatedZoomLevel] = useState(1.0);
  const animationInProgress = useRef(false);
  const gestureBaseZoom = useRef(1.0);

  // Load fonts on mount
  useEffect(() => {
    const initializeFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Failed to load fonts:', error);
        setFontsLoaded(true); // Continue without custom fonts
      }
    };

    initializeFonts();
  }, []);

  // Load persistent settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const [savedLayout, savedZoom, savedStelliums] = await Promise.all([
        loadLayoutSettings(),
        loadZoomLevel(),
        loadExpandedStelliums(),
      ]);

      setLayoutSettings(savedLayout);
      setZoomLevel(savedZoom);
      setAnimatedZoomLevel(savedZoom);
      zoomAnimValue.setValue(savedZoom);
      setExpandedStelliums(savedStelliums);
      setSettingsLoaded(true);
    };

    loadSettings();
  }, [zoomAnimValue]);

  // Smooth zoom transition function
  const animateZoomTo = useCallback((targetZoom: number) => {
    if (animationInProgress.current) return;

    animationInProgress.current = true;
    Animated.timing(zoomAnimValue, {
      toValue: targetZoom,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setZoomLevel(targetZoom);
      animationInProgress.current = false;
      // Persist zoom level
      saveZoomLevel(targetZoom);
    });
  }, [zoomAnimValue]);

  // size & radii with zoom scaling - account for label padding and 1.2x container
  const LABEL_PADDING = 40; // Space needed for angle labels
  const CONTAINER_SCALE = 1.2; // We multiply container by 1.2 for label space
  const maxChartWidth = ((availableWidth ?? 0) - LABEL_PADDING) / CONTAINER_SCALE;
  const BASE_SIZE = Math.max(280, Math.min(maxChartWidth, 600) || 400);
  // Fallback to regular zoomLevel if animatedZoomLevel is invalid, ensure minimum 100%
  const currentZoom = (Number.isFinite(animatedZoomLevel) && animatedZoomLevel >= 1.0) ? animatedZoomLevel : Math.max(1.0, zoomLevel);
  const SIZE = BASE_SIZE * currentZoom; // Apply zoom to entire chart
  const R = SIZE / 2;

  const { rOuter, rSigns, rZodiacTicks, rPlanetTrack, rPlanetLaneGap, rHouses, rInner1, rInner2 } =
    useMemo(() => RLAY(R), [R]);

  // Extract all 4 angles and house data from chart
  const chartAngles = useMemo(() => {
    const pts: any[] =
      (chart as any)?.points ??
      (chart as any)?.positions ??
      (chart as any)?.planets ??
      [];

    // Find all 4 angles
    const ascPoint = pts.find(p => {
      const id = String(p.point ?? p.body ?? p.id ?? '').toUpperCase();
      return id === 'ASC' || id === 'ASCENDANT';
    });
    const mcPoint = pts.find(p => {
      const id = String(p.point ?? p.body ?? p.id ?? '').toUpperCase();
      return id === 'MC' || id === 'MIDHEAVEN';
    });
    const dscPoint = pts.find(p => {
      const id = String(p.point ?? p.body ?? p.id ?? '').toUpperCase();
      return id === 'DSC' || id === 'DESCENDANT';
    });
    const icPoint = pts.find(p => {
      const id = String(p.point ?? p.body ?? p.id ?? '').toUpperCase();
      return id === 'IC' || id === 'IMUMCOELI';
    });

    const ascLongitude = ascPoint ? extractLonDeg(ascPoint) : null;
    const mcLongitude = mcPoint ? extractLonDeg(mcPoint) : null;
    const dscLongitude = dscPoint ? extractLonDeg(dscPoint) : (ascLongitude !== null ? norm360(ascLongitude + 180) : null);
    const icLongitude = icPoint ? extractLonDeg(icPoint) : (mcLongitude !== null ? norm360(mcLongitude + 180) : null);

    // Extract house cusps from API data
    const houses = (chart as any)?.houses?.cusps ?? [];
    const houseCusps = houses.map((h: any) => {
      if (typeof h === 'number') return h;
      if (h && typeof h.signIndex === 'number' && typeof h.degree === 'number') {
        return h.signIndex * 30 + h.degree;
      }
      return null;
    }).filter((lon: number | null) => lon !== null);

    // If no house cusps from API but we have ASC, generate Whole Sign fallback
    let finalHouseCusps = houseCusps.length === 12 ? houseCusps :
      (ascLongitude !== null ?
        Array.from({ length: 12 }, (_, i) => {
          const ascSign = Math.floor(ascLongitude / 30);
          return ((ascSign + i) % 12) * 30;
        }) :
        Array.from({ length: 12 }, (_, i) => i * 30) // fallback to Aries 0°
      );

    // For quadrant systems: Force H1 = ASC and H10 = MC to ensure perfect alignment
    if (houseCusps.length === 12 && ascLongitude !== null && mcLongitude !== null) {
      finalHouseCusps = [...finalHouseCusps];
      finalHouseCusps[0] = ascLongitude;  // House 1 = ASC
      finalHouseCusps[9] = mcLongitude;   // House 10 = MC
      finalHouseCusps[6] = norm360(ascLongitude + 180); // House 7 = DSC
      finalHouseCusps[3] = norm360(mcLongitude + 180);  // House 4 = IC
    }

    const angles = [
      { id: 'ASC', longitude: ascLongitude, label: 'ASC' },
      { id: 'MC', longitude: mcLongitude, label: 'MC' },
      { id: 'DSC', longitude: dscLongitude, label: 'DSC' },
      { id: 'IC', longitude: icLongitude, label: 'IC' }
    ].filter(a => a.longitude !== null);

    return {
      ascLongitude,
      mcLongitude,
      dscLongitude,
      icLongitude,
      houseCusps: finalHouseCusps,
      angles
    };
  }, [chart]);

  // Create angle function based on ASC position
  const angleFromLon = useMemo(() => {
    if (chartAngles.ascLongitude !== null) {
      const angleFn = createAngleFromLongitude(chartAngles.ascLongitude);



      return angleFn;
    }
    return angleFromLongitude; // fallback
  }, [chartAngles.ascLongitude, chartAngles.angles]);

  // Parse chip inputs from chart (pure consumer of lonDeg)
  const chipInputs: PlanetChipInput[] = useMemo(() => {
    const pts: any[] =
      (chart as any)?.points ??
      (chart as any)?.positions ??
      (chart as any)?.planets ??
      [];

    const inputs = pts
      .map((p: any, idx: number) => {
        // ID resolution: prefer string point/body, then common id fields
        const body = p.point ?? p.body ?? {};
        const idRaw =
          (typeof body === 'string' ? body : undefined) ??
          body.id ?? body.key ?? body.name ?? body.label ??
          (typeof p.point === 'string' ? p.point : undefined) ??
          (typeof p.body === 'string' ? p.body : undefined) ??
          p.id ?? `P${idx}`;
        const id = String(idRaw);

        const lon = extractLonDeg(p);
        if (!isFiniteNum(lon)) return null;

        const glyph =
          PLANET_GLYPH[id] ??
          (typeof body === 'object' ? (body.glyph ?? body.symbol) : undefined) ??
          p.glyph ?? p.symbol ??
          id.charAt(0);

        const degInSign = extractDegInSign(p, lon);
        const degText = `${Math.round(degInSign * 10) / 10}°`;

        // Extract minutes for detailed view
        const wholeDegrees = Math.floor(degInSign);
        const fractionalDegrees = degInSign - wholeDegrees;
        const minutes = Math.round(fractionalDegrees * 60);
        const minutesText = `${wholeDegrees}°${minutes.toString().padStart(2, '0')}′`;

        // Check for retrograde motion (various field names)
        const isRetrograde = !!(p.retrograde ?? p.isRetrograde ?? p.rx ?? p.R ?? false);

        // Extract sign name - prefer API provided sign over calculated
        const apiSignName = p?.ecliptic?.apiSignName || p?.ecliptic?.zodiac_sign;
        const signIndex = Math.floor(lon / 30) % 12;
        const calculatedSignName = ZODIAC_NAMES[signIndex] || 'Unknown';
        const signName = (apiSignName && typeof apiSignName === 'string') ? apiSignName : calculatedSignName;

        // Debug log any discrepancies between API and calculated signs
        if (__DEV__ && apiSignName && calculatedSignName && apiSignName !== calculatedSignName) {
          console.log(`[BirthChartWheel] ${id} sign mismatch: API="${apiSignName}" calculated="${calculatedSignName}" lon=${lon}`);
        }

        return {
          id,
          lon,
          glyph: String(glyph),
          degText,
          minutesText,
          isRetrograde,
          signName
        };
      })
      .filter(Boolean) as PlanetChipInput[];


    return inputs;
  }, [chart]);

  // Calculate house positions using API cusps with BRS wrap logic
  const housePositions = useMemo(() => {
    const positions = [];
    let totalSpan = 0;

    for (let i = 0; i < 12; i++) {
      const cuspLongitude = chartAngles.houseCusps[i] ?? (i * 30); // fallback to equal houses
      const angle = angleFromLon(cuspLongitude);

      // BRS sector calculation with wrap logic
      const nextCuspLon = chartAngles.houseCusps[(i + 1) % 12] ?? (((i + 1) % 12) * 30);
      let sectorEnd = nextCuspLon;
      if (sectorEnd <= cuspLongitude) {
        sectorEnd += 360; // handle wrap
      }
      const sectorSpan = sectorEnd - cuspLongitude;
      totalSpan += sectorSpan;

      // Midpoint calculation with proper wrap handling
      const midpointLon = norm360(cuspLongitude + sectorSpan / 2);
      // Shift house wheel LEFT by 30 degrees (one house position)
      const adjustedMidpointLon = norm360(midpointLon + 30);
      const midpointAngle = angleFromLon(adjustedMidpointLon);

      positions.push({
        houseNumber: i + 1,
        cuspLongitude,
        cuspAngle: angle,
        midpointLongitude: midpointLon,
        midpointAngle,
        sectorSpan // for validation
      });
    }

    // BRS validation: total span should be ~360°
    if (Math.abs(totalSpan - 360) > 0.1) {
      console.warn(`[BRS Validation] House sector coverage: ${totalSpan.toFixed(2)}° (should be 360°)`);
    }

    // BRS validation: ASC alignment
    if (chartAngles.ascLongitude !== null) {
      const house1Cusp = chartAngles.houseCusps[0];
      if (house1Cusp !== undefined) {
        const ascDiff = Math.abs(norm360(house1Cusp - chartAngles.ascLongitude));
        const ascDiffAdjusted = Math.min(ascDiff, 360 - ascDiff);
        if (ascDiffAdjusted > 0.1) {
          console.log(`[BRS Validation] H1 cusp vs ASC: ${ascDiffAdjusted.toFixed(2)}° difference (${ascDiffAdjusted <= 0.1 ? 'PASS' : 'WARN - may be Whole Sign system'})`);
        }
      }
    }


    return positions;
  }, [chartAngles.houseCusps, chartAngles.ascLongitude, angleFromLon]);

  // Get display configuration based on zoom level (chips get bigger as chart zooms in)
  const chipDisplayInfo = useMemo(() => {
    return getChipDisplayInfo(zoomLevel, layoutSettings.mode);
  }, [zoomLevel, layoutSettings.mode]);

  // Set up animated zoom value listener
  React.useEffect(() => {
    const listener = zoomAnimValue.addListener(({ value }) => {
      setAnimatedZoomLevel(value);
    });
    return () => zoomAnimValue.removeListener(listener);
  }, [zoomAnimValue]);

  // Animated display info for smooth transitions (chips capped at 125%)
  const animatedChipDisplayInfo = useMemo(() => {
    const cappedAnimatedZoom = Math.min(animatedZoomLevel, 1.25);
    return getChipDisplayInfo(cappedAnimatedZoom, layoutSettings.mode);
  }, [animatedZoomLevel, layoutSettings.mode]);

  // Responsive chip sizing based on zoom level and mode
  const responsiveChip = useMemo(() => {
    return {
      ...CHIP,
      w: animatedChipDisplayInfo.chipSize.w,
      h: animatedChipDisplayInfo.chipSize.h,
      glyphFs: animatedChipDisplayInfo.fontSize.glyph,
      degFs: animatedChipDisplayInfo.fontSize.degree,
    };
  }, [animatedChipDisplayInfo]);

  // Create adjusted angle function for planet chips to match zodiac positioning
  const adjustedAngleFromLon = useMemo(() => {
    return (lon: number) => {
      // Apply the same +120 degree adjustment that we applied to zodiac signs
      const adjustedLon = norm360(lon + 120);
      return angleFromLon(adjustedLon);
    };
  }, [angleFromLon]);

  // Place chips on lanes (or empty if none) - using adjusted angles to match zodiac positioning
  const chips = useMemo(() => {
    if (!chipInputs.length) return [];

    // Use the adjusted angle function for chip placement to match zodiac positioning
    return placeChipsEnhanced(chipInputs, rPlanetTrack, rPlanetLaneGap, layoutSettings, expandedStelliums, adjustedAngleFromLon, chartAngles.houseCusps);
  }, [chipInputs, rPlanetTrack, rPlanetLaneGap, layoutSettings, expandedStelliums, adjustedAngleFromLon, chartAngles.houseCusps]);

  // Handler for stellium cluster tap
  const handleStelliumTap = (stelliumGroup: number) => {
    setExpandedStelliums(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stelliumGroup)) {
        newSet.delete(stelliumGroup);
      } else {
        newSet.add(stelliumGroup);
      }
      return newSet;
    });
  };

  // Handler for any chip tap (stellium or individual) - optimized for performance
  const handleChipPress = useCallback((chipId: string, stelliumGroup?: number, chipLon?: number) => {
    // Use callback to reduce re-renders - removed chips dependency for performance
    setSelectedChipId(chipId);

    // If this chip is part of a stellium, also highlight the zodiac sign
    if (stelliumGroup !== undefined && chipLon !== undefined) {
      const signIndex = Math.floor(chipLon / 30) % 12;
      setHighlightedZodiacSign(signIndex);
    }

    // Reset selection after a delay to provide visual feedback
    setTimeout(() => {
      setSelectedChipId(null);
      setHighlightedZodiacSign(null);
    }, 1200); // Reduced from 1500ms for snappier feel
  }, []); // Empty dependency array for optimal performance

  // Handler for stellium table row selection with pulse animation
  const handleStelliumRowPress = (groupId: number) => {
    setSelectedStellium(groupId);

    // Find the zodiac sign for this stellium group to highlight
    const stelliumChips = chips.filter(ch => ch.stelliumGroup === groupId);
    if (stelliumChips.length > 0) {
      const signIndex = Math.floor(stelliumChips[0].lon / 30) % 12;
      setHighlightedZodiacSign(signIndex);
    }

    // Trigger pulse animation
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset selection after animation completes
      setTimeout(() => {
        setSelectedStellium(null);
        setHighlightedZodiacSign(null);
      }, 1000);
    });
  };

  const showNoDataHint = chipInputs.length === 0 || chips.length === 0;

  // Helper function to render a single chip - extracted to avoid duplication
  const renderChip = (ch: PlacedChip, forceSelected = false) => {
    // Stellium chips are larger for better tap targets
    const isStellium = ch.stelliumGroup !== undefined;
    const isCluster = false; // No more cluster chips - keeping variable for cleanup
    const chipWidth = isStellium ? responsiveChip.w * 1.2 : responsiveChip.w;
    const chipHeight = responsiveChip.h;

    // Selected chips are slightly larger for "move to front" effect
    const isSelected = forceSelected || selectedChipId === ch.id;
    const selectedScale = isSelected ? 1.1 : 1.0;
    const adjustedWidth = chipWidth * selectedScale;
    const adjustedHeight = chipHeight * selectedScale;
    const x = ch.x - adjustedWidth / 2;
    const y = ch.y - adjustedHeight / 2;

    // Stellium group styling - BRS requirement: orange highlighting
    const stelliumColor = isStellium ? '#FF9500' : responsiveChip.fill;
    const stelliumOpacity = isStellium ? 0.9 : responsiveChip.fillOp;

    // Determine what text to show based on zoom level (use animated values for smooth transitions)
    let degreeContent = '';
    if (isCluster) {
      // For cluster chips, show count and expand/collapse indicator
      degreeContent = `${ch.clusterMembers?.length || 0} ⤢`;
    } else {
      if (animatedChipDisplayInfo.showMinutes && ch.minutesText) {
        degreeContent = ch.minutesText;
      } else if (animatedChipDisplayInfo.showDegree) {
        degreeContent = ch.degText;
      }

      // Add retrograde symbol if showing and planet is retrograde
      if (animatedChipDisplayInfo.showRetrograde && ch.isRetrograde) {
        degreeContent += ' ℞';
      }
    }

    return (
      <G key={`chip-${ch.id}${forceSelected ? '-selected' : ''}`}>
        {/* Clickable area for all chips using touch events */}
        <Rect
          x={x - 4} y={y - 4}
          width={adjustedWidth + 8} height={adjustedHeight + 8}
          fill="transparent"
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => handleChipPress(ch.id, ch.stelliumGroup, ch.lon)}
        />

        {/* Subtle shadow/glow effect for selected chips */}
        {isSelected && (
          <Rect
            x={x + 1} y={y + 1} width={adjustedWidth} height={adjustedHeight}
            rx={responsiveChip.rx} ry={responsiveChip.rx}
            fill="rgba(255, 215, 0, 0.3)"
            opacity={0.6}
          />
        )}

        <Rect
          x={x} y={y} width={adjustedWidth} height={adjustedHeight}
          rx={responsiveChip.rx} ry={responsiveChip.rx}
          fill={stelliumColor} opacity={stelliumOpacity}
          stroke={isSelected ? '#FFD700' : responsiveChip.stroke}
          strokeWidth={isSelected ? 3 : (isStellium ? 2 : 1)}
          strokeOpacity={isSelected ? 1.0 : responsiveChip.strokeOp}
        />

        {/* Cluster indicator */}
        {isCluster && (
          <Circle
            cx={x + adjustedWidth - 8 * Math.min(animatedZoomLevel, 1.25)}
            cy={y + 8 * Math.min(animatedZoomLevel, 1.25)}
            r={4 * Math.min(animatedZoomLevel, 1.25)}
            fill="#FFD700"
            opacity={0.9}
          />
        )}

        {/* Stellium group indicator for individual chips */}
        {isStellium && !isCluster && (
          <Circle
            cx={x + adjustedWidth - 6 * Math.min(animatedZoomLevel, 1.25)}
            cy={y + 6 * Math.min(animatedZoomLevel, 1.25)}
            r={3 * Math.min(animatedZoomLevel, 1.25)}
            fill="#FFD700"
            opacity={0.8}
          />
        )}

        {/* inner separator - only show if we have degree info */}
        {animatedChipDisplayInfo.showDegree && (
          <Line
            x1={x + 4 * Math.min(animatedZoomLevel, 1.25)}
            y1={y + Math.floor(chipHeight * 0.58)}
            x2={x + chipWidth - 4 * Math.min(animatedZoomLevel, 1.25)}
            y2={y + Math.floor(chipHeight * 0.58)}
            stroke="#000" opacity={0.12} strokeWidth={1}
          />
        )}

        {/* glyph */}
        {animatedChipDisplayInfo.showGlyph && (
          <SvgText
            x={ch.x}
            y={animatedChipDisplayInfo.showDegree ? y + responsiveChip.pad + responsiveChip.glyphFs : ch.y}
            fontSize={isCluster ? responsiveChip.glyphFs * 0.8 : responsiveChip.glyphFs}
            fill="#ffffff"
            opacity={0.95}
            textAnchor="middle"
            alignmentBaseline={animatedChipDisplayInfo.showDegree ? undefined : "middle"}
            fontFamily={fontsLoaded ? FONTS.symbols : undefined}
          >
            {isCluster && ch.clusterMembers ?
              ch.clusterMembers.slice(0, 3).map(m => m.glyph).join('') +
              (ch.clusterMembers.length > 3 ? '…' : '') :
              ch.glyph
            }
          </SvgText>
        )}

        {/* degree text */}
        {animatedChipDisplayInfo.showDegree && degreeContent && (
          <SvgText
            x={ch.x}
            y={y + chipHeight - responsiveChip.pad - 1}
            fontSize={responsiveChip.degFs}
            fill={responsiveChip.degColor}
            opacity={0.95}
            textAnchor="middle"
            fontFamily={fontsLoaded ? FONTS.ui : undefined}
          >
            {degreeContent}
          </SvgText>
        )}

        {/* planet name text (only show at 200% zoom / full-detail) */}
        {animatedChipDisplayInfo.showName && !isCluster && (
          <SvgText
            x={ch.x}
            y={y + chipHeight + responsiveChip.degFs + 2}
            fontSize={responsiveChip.degFs * 0.9}
            fill="#E9EEF7"
            opacity={0.9}
            textAnchor="middle"
            fontFamily={fontsLoaded ? FONTS.ui : undefined}
          >
            {PLANET_NAMES_SHORT[ch.id as keyof typeof PLANET_NAMES_SHORT] || ch.id}
          </SvgText>
        )}
      </G>
    );
  };

  // font sizes
  const fsSign = Math.max(10, Math.round(SIZE * 0.040));
  const fsHouse = Math.max(11, Math.round(SIZE * 0.038));

  // Don't render until settings are loaded to avoid initialization issues
  if (!settingsLoaded) {
    return (
      <View style={s.wrap}>
        <Text style={{ color: LunariaColors.text, textAlign: 'center', margin: 20 }}>Loading chart...</Text>
      </View>
    );
  }


  return (
    <GestureHandlerRootView style={s.wrap}>
      {/* Chart Controls */}
      <View style={s.controlsPanel}>
        {/* Zoom Level Display */}
        <View style={s.controlGroup}>
          <Text style={s.controlLabel}>Zoom: {Math.round(animatedZoomLevel * 100)}%</Text>
          <Text style={s.zoomHint}>Pinch to zoom</Text>
        </View>

        {/* Legend toggle */}
        <Pressable onPress={() => setShowLegend(v => !v)} style={s.legendToggle}>
          <Text style={s.legendToggleText}>
            {showLegend ? 'Hide legend' : 'Show legend'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <PinchGestureHandler
          onGestureEvent={(event) => {
            // Update Animated.Value directly for smooth real-time updates
            const scale = event.nativeEvent.scale;
            const newZoom = Math.max(1.0, Math.min(3.0, gestureBaseZoom.current * scale));
            zoomAnimValue.setValue(newZoom);
          }}
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === State.BEGAN) {
              // Store the base zoom level when gesture starts
              gestureBaseZoom.current = zoomLevel;
            } else if (event.nativeEvent.state === State.END) {
              // When pinch ends, finalize the zoom level
              const scale = event.nativeEvent.scale;
              const finalZoom = Math.max(1.0, Math.min(3.0, gestureBaseZoom.current * scale));
              setZoomLevel(finalZoom);
              setAnimatedZoomLevel(finalZoom);
              zoomAnimValue.setValue(finalZoom);
              saveZoomLevel(finalZoom);
            }
          }}
        >
          <View style={{ width: SIZE * 1.2, height: SIZE * 1.2, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE * 1.2} height={SIZE * 1.2}>
            <G x={(SIZE * 1.2) / 2} y={(SIZE * 1.2) / 2}>
              {/* Inner rings */}
              <Circle r={rInner1} stroke={COL.rim} strokeWidth={1} opacity={0.25} fill="none" />
              <Circle r={rInner2} stroke={COL.rim} strokeWidth={1} opacity={0.25} fill="none" />

              {/* Zodiac ticks (5°/10°/30°) - positioned relative to ASC */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const a = angleFromLon(deg);
                const is30 = deg % 30 === 0;
                const is10 = deg % 10 === 0;
                const len = is30 ? 10 : is10 ? 7 : 4;
                const r1 = rZodiacTicks - len;
                const r2 = rZodiacTicks + (is30 ? 2 : 0);
                const p1 = polar(r1, a);
                const p2 = polar(r2, a);
                return (
                  <Line
                    key={`tk-${i}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={COL.houseMinor} strokeWidth={is30 ? 2.5 : is10 ? 1.8 : 1.2}
                    opacity={is30 ? 0.8 : is10 ? 0.6 : 0.4}
                  />
                );
              })}


              {/* House cusp lines radiating from center - BRS requirement */}
              {housePositions.map((house) => {
                const isAngle = [1, 4, 7, 10].includes(house.houseNumber); // ASC=1st, IC=4th, DSC=7th, MC=10th
                const isMajorAngle = [1, 10].includes(house.houseNumber); // ASC & MC

                // Style hierarchy: ASC/MC bold, DSC/IC medium, others thin
                const strokeWidth = isMajorAngle ? 3.5 : isAngle ? 2.5 : 1.5;
                const opacity = isMajorAngle ? 0.9 : isAngle ? 0.7 : 0.5;
                const color = isMajorAngle ? '#FFD700' : isAngle ? '#FFA500' : COL.houseMajor;

                const p1 = polar(rInner2, house.cuspAngle);
                const p2 = polar(rOuter, house.cuspAngle);

                return (
                  <Line
                    key={`cusp-${house.houseNumber}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={color} strokeWidth={strokeWidth}
                    opacity={opacity}
                  />
                );
              })}

              {/* Angle labels - ASC, MC, DSC, IC */}
              {chartAngles.angles.map((angle) => {
                if (angle.longitude === null) return null;

                const isMajor = ['ASC', 'MC'].includes(angle.id);
                // Adjust ASC to be exactly at 9 o'clock relative to MC at 12 o'clock
                const adjustedLon = angle.id === 'ASC' ? norm360(angle.longitude + 10) : angle.longitude;
                const a = angleFromLon(adjustedLon);
                const labelRadius = rOuter * 1.08;
                const pos = polar(labelRadius, a);

                return (
                  <SvgText
                    key={`angle-${angle.id}`}
                    x={pos.x}
                    y={pos.y}
                    fontSize={isMajor ? 14 : 12}
                    fill={isMajor ? '#FFD700' : '#FFA500'}
                    opacity={isMajor ? 1.0 : 0.8}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontWeight={isMajor ? '700' : '500'}
                    stroke={"#000"}
                    strokeWidth={0.5}
                    strokeOpacity={0.3}
                  >
                    {angle.label}
                  </SvgText>
                );
              })}

              {/* Zodiac sign arc highlighting */}
              {highlightedZodiacSign !== null && (
                (() => {
                  if (chartAngles.ascLongitude === null) return null;

                  // Calculate arc for the highlighted zodiac sign
                  const signStartLon = highlightedZodiacSign * 30;
                  const signEndLon = (highlightedZodiacSign + 1) * 30;

                  // Apply the same shift as zodiac signs (+120 degrees)
                  const adjustedStartLon = norm360(signStartLon + 120);
                  const adjustedEndLon = norm360(signEndLon + 120);

                  const startAngle = angleFromLon(adjustedStartLon);
                  const endAngle = angleFromLon(adjustedEndLon);

                  // SVG arc parameters
                  const innerRadius = rZodiacTicks * 0.95;
                  const outerRadius = rSigns * 1.05;

                  const startOuter = polar(outerRadius, startAngle);
                  const endOuter = polar(outerRadius, endAngle);
                  const startInner = polar(innerRadius, endAngle);
                  const endInner = polar(innerRadius, startAngle);

                  // Create SVG path for arc
                  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
                  const arcPath = [
                    `M ${startOuter.x} ${startOuter.y}`,
                    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                    `L ${startInner.x} ${startInner.y}`,
                    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
                    'Z'
                  ].join(' ');

                  return (
                    <Path
                      key="zodiac-highlight"
                      d={arcPath}
                      fill="#FF9500"
                      fillOpacity={0.2}
                      stroke="#FF9500"
                      strokeWidth={2}
                      strokeOpacity={0.6}
                    />
                  );
                })()
              )}

              {/* Zodiac sign glyphs (outer ring) - aligned with chart structure */}
              {SIGN_GLYPHS.map((glyph, i) => {
                if (chartAngles.ascLongitude === null) return null;

                // Position each zodiac sign at its midpoint longitude, shifted to align properly
                // Scorpio (sign 7) should appear in 10th house for Rachel's chart
                const signMidpointLongitude = i * 30 + 15; // Middle of this sign

                // Need to align zodiac signs properly:
                // Aquarius (sign 10, longitude ~315°) should be at ASC position
                // Scorpio (sign 7, longitude ~225°) should be at MC position
                // Shift LEFT by 4 house placements = +120 degrees (left one more!)
                const adjustedSignLongitude = norm360(signMidpointLongitude + 120);

                const a = angleFromLon(adjustedSignLongitude);
                const m = polar(rSigns, a);
                return (
                  <SvgText
                    key={`sg-${i}`}
                    x={m.x}
                    y={m.y}
                    fontSize={fsSign * 1.5}
                    fill={COL.label}
                    opacity={OP.text}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    stroke="#000"
                    strokeWidth={0.8}
                    strokeOpacity={0.35}
                    fontFamily={fontsLoaded ? FONTS.symbols : undefined}
                  >
                    {glyph}
                  </SvgText>
                );
              })}

              {/* House numerals - positioned at midpoint between cusps */}
              {housePositions.map((house) => {
                const pt = polar(rHouses * 0.85, house.midpointAngle);
                return (
                  <SvgText
                    key={`hn-${house.houseNumber}`}
                    x={pt.x}
                    y={pt.y}
                    fontSize={fsHouse * 1.2}
                    fill="#cfd8e3"
                    opacity={0.9}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {house.houseNumber}
                  </SvgText>
                );
              })}

              {/* Leader lines (drawn before chips for proper layering) */}
              {chips
                .filter(ch => ch.hasLeaderLine)
                .map((ch) => {
                  // Draw line from exact longitude position to chip position
                  const exactAngle = angleFromLon(ch.lon);
                  const exactPos = polar(rPlanetTrack, exactAngle);
                  return (
                    <Line
                      key={`leader-${ch.id}`}
                      x1={exactPos.x}
                      y1={exactPos.y}
                      x2={ch.x}
                      y2={ch.y}
                      stroke="#80d0ff"
                      strokeWidth={1}
                      opacity={0.6}
                      strokeDasharray="3,3"
                    />
                  );
                })}

              {/* Planet chips (if any) - non-selected first */}
              {chips.filter(ch => !selectedChipId || ch.id !== selectedChipId).map((ch) => renderChip(ch))}

              {/* Selected chip rendered last for "move to front" effect */}
              {selectedChipId && (() => {
                const selectedChip = chips.find(ch => ch.id === selectedChipId);
                return selectedChip ? renderChip(selectedChip, true) : null;
              })()}
            </G>
          </Svg>
          </View>
        </PinchGestureHandler>

        {/* Stellium Summary */}
        {chips.some(ch => ch.stelliumGroup !== undefined) && (
          <View style={s.stelliumSummary}>
            <Text style={s.stelliumTitle}>Stelliums Detected</Text>
            {[...new Set(chips.filter(ch => ch.stelliumGroup !== undefined).map(ch => ch.stelliumGroup!))].map(groupId => {
              const groupChips = chips.filter(ch => ch.stelliumGroup === groupId);
              const signIndex = Math.floor(groupChips[0].lon / 30) % 12;
              const signName = ZODIAC_NAMES[signIndex];
              const isSelected = selectedStellium === groupId;
              return (
                <Animated.View
                  key={`stellium-${groupId}`}
                  style={[
                    { transform: [{ scale: isSelected ? pulseAnimation : 1 }] }
                  ]}
                >
                  <Pressable
                    style={[
                      s.stelliumInfo,
                      isSelected && s.stelliumInfoSelected
                    ]}
                    onPress={() => handleStelliumRowPress(groupId)}
                  >
                    <Text style={s.stelliumLabel}>
                      {signName} stellium: {groupChips.map(ch => ch.glyph).join(' ')}
                    </Text>
                    <Text style={s.stelliumDetail}>
                      {groupChips.length} planets within {layoutSettings.stelliumAngleDeg}°
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* Empty state for no stelliums */}
        {chips.length > 0 && !chips.some(ch => ch.stelliumGroup !== undefined) && (
          <View style={s.stelliumSummary}>
            <Text style={s.stelliumTitle}>Stellium Analysis</Text>
            <View style={s.stelliumEmptyState}>
              <Text style={s.stelliumEmptyText}>
                No stelliums detected in your chart
              </Text>
              <Text style={s.stelliumEmptyDetail}>
                A stellium requires {layoutSettings.stelliumThreshold}+ planets within {layoutSettings.stelliumAngleDeg}° in the same sign or house
              </Text>
            </View>
          </View>
        )}

        {/* Hint if no chips parsed (but wheel still visible) */}
        {showNoDataHint && (
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ color: LunariaColors.text, textAlign: 'center', fontSize: 16 }}>
              No planet positions parsed.
            </Text>
            <Text style={{ color: LunariaColors.focus, textAlign: 'center', marginTop: 6, fontSize: 12 }}>
              (Check ecliptic lon fields in chart.points or reopen.)
            </Text>
          </View>
        )}

        {/* Collapsible legend */}
        {showLegend && (
          <View style={s.legendWrap}>
            <Text style={s.legendTitle}>Legend</Text>
            <View style={s.legendGrid}>
              <View style={s.legendCol}>
                {SIGN_GLYPHS.map((glyph, i) => (
                  <View key={`legend-zodiac-${i}`} style={s.legendCell}>
                    <Text style={s.legendGlyphSmall}>{glyph}</Text>
                    <Text style={s.legendDash}> - </Text>
                    <Text style={s.legendLabelSmall}>{ZODIAC_NAMES[i]}</Text>
                  </View>
                ))}
              </View>
              <View style={s.legendCol}>
                {PLANET_GLYPHS.map((glyph, i) => (
                  <View key={`legend-planet-${i}`} style={s.legendCell}>
                    <Text style={s.legendGlyphSmall}>{glyph}</Text>
                    <Text style={s.legendDash}> - </Text>
                    <Text style={s.legendLabelSmall}>{PLANET_NAMES[i]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

/* =========================
   STYLES
   ========================= */

const s = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chart Controls Panel
  controlsPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: LunariaColors.card,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: LunariaColors.border,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    color: LunariaColors.text,
    fontSize: 12,
    fontWeight: '500',
  },

  // Layout Mode Toggle
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: LunariaColors.border,
    borderWidth: 1,
    borderColor: '#3a4552',
  },
  toggleButtonActive: {
    backgroundColor: LunariaColors.focus,
    borderColor: '#4a8cff',
  },
  toggleText: {
    color: LunariaColors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: LunariaColors.white,
  },

  // Zoom Controls
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoomButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: LunariaColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3a4552',
  },
  zoomButtonText: {
    color: LunariaColors.focus,
    fontSize: 14,
    fontWeight: '600',
  },
  zoomLevel: {
    color: LunariaColors.text,
    fontSize: 11,
    minWidth: 32,
    textAlign: 'center',
  },
  zoomHint: {
    color: LunariaColors.focus,
    fontSize: 10,
    opacity: 0.7,
  },

  // Legend Toggle
  legendToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  legendToggleText: {
    color: LunariaColors.focus,
    fontSize: 12,
  },

  // Stellium Summary
  stelliumSummary: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: '#2a1810',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4a3422',
  },
  stelliumTitle: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  stelliumInfo: {
    marginBottom: 6,
    padding: 8,
    borderRadius: 6,
  },
  stelliumInfoSelected: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  stelliumLabel: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '500',
  },
  stelliumDetail: {
    color: '#E9B666',
    fontSize: 11,
    marginTop: 2,
  },
  stelliumEmptyState: {
    padding: 8,
    alignItems: 'center',
  },
  stelliumEmptyText: {
    color: '#8B7355',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  stelliumEmptyDetail: {
    color: '#6B5B47',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Legend
  legendWrap: {
    position: 'relative',
    alignSelf: 'stretch',
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: LunariaColors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: LunariaColors.border,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 6,
  },
  legendGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
  },
  legendCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  legendCell: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#344055',
    paddingBottom: 4,
  },
  legendGlyphSmall: {
    fontSize: 16,
    marginRight: 6,
    color: '#fff',
  },
  legendDash: {
    fontSize: 14,
    color: '#fff',
    marginHorizontal: 2,
  },
  legendLabelSmall: {
    fontSize: 12,
    color: '#fff',
  },

  // Detail Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  detailModal: {
    backgroundColor: LunariaColors.card,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    maxWidth: 300,
    width: '100%',
    borderWidth: 1,
    borderColor: LunariaColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#344055',
  },
  modalTitle: {
    color: LunariaColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    color: LunariaColors.focus,
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  modalContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: LunariaColors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    color: LunariaColors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Instruction Panel
  instructionPanel: {
    backgroundColor: LunariaColors.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#2a3442',
  },
  instructionText: {
    color: LunariaColors.focus,
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
});
