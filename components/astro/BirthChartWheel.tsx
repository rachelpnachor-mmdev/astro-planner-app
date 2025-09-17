// components/astro/BirthChartWheel.tsx
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import type { BirthChart } from '../../lib/astro/types';

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
  rSigns:        R * 0.86,  // zodiac glyphs (outer ring)
  rZodiacTicks:  R * 0.83,  // 5°/10°/30° ticks
  rPlanetTrack:  R * 0.76,  // base radius for chips
  rPlanetLaneGap:R * 0.055, // separation for lanes
  rHouses:       R * 0.56,  // house numerals radius
  rInner1:       R * 0.44,
  rInner2:       R * 0.40,
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
const ANGLE_OFFSET = 90; // Aries at top
const norm360 = (x: number) => ((x % 360) + 360) % 360;
const angleFromLongitude = (lon: number) => (-lon + ANGLE_OFFSET) * DEG;
const polar = (r: number, ang: number) => ({ x: r * Math.cos(ang), y: r * Math.sin(ang) });

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
const looksRadians = (x: number) => Math.abs(x) <= 2 * Math.PI + 1e-6;

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
   DATA EXTRACTORS
   ========================= */

// Absolute ecliptic longitude in DEGREES [0..360)
function extractLonDeg(p: any): number {
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
      if (isFiniteNum(d)) return norm360(d);
    }

    const n = toNum(val);
    if (isFiniteNum(n)) {
      const deg = looksRadians(n) ? radToDeg(n) : n;
      return norm360(deg);
    }
  }

  // explicit rad paths as last resort
  const radPaths: (string | number)[][] = [
    ['ecliptic','longitude','rad'],
    ['ecliptic','longitude','radians'],
    ['ecliptic','lon','rad'],
    ['ecliptic','lon','radians'],
    ['lonRad'], ['longitudeRad'],
  ];
  for (const path of radPaths) {
    const val = getPath(base, path);
    const n = toNum(val);
    if (isFiniteNum(n)) return norm360(radToDeg(n));
  }

  return NaN;
}

// Degree-in-sign for the label (0..30). If absent, derive from absolute lon.
function extractDegInSign(p: any, lonDeg: number): number {
  const e = p?.ecliptic ?? p?.ecl ?? {};
  const fields = [e.deg, e.degree, e.degrees, p.deg, p.degree];
  for (const f of fields) {
    const n = toNum(f);
    if (isFiniteNum(n)) return n;
  }
  return norm360(lonDeg) % 30;
}

/* =========================
   CHIP LAYOUT
   ========================= */

type PlanetChipInput = {
  id: string;
  lon: number;      // 0..360
  glyph: string;    // symbol
  degText: string;  // '13.5°'
};

type PlacedChip = PlanetChipInput & {
  angle: number;    // radians (after any nudges)
  lane: 0 | 1 | 2;
  r: number;
  x: number;
  y: number;
};

// simple 3-lane placer with minimal overlap
function placeChips(items: PlanetChipInput[], rBase: number, rGap: number): PlacedChip[] {
  const sorted = items
    .map(p => ({ ...p, angle: angleFromLongitude(p.lon) }))
    .sort((a,b) => a.angle - b.angle);

  const out: PlacedChip[] = [];
  const last: (PlacedChip | undefined)[] = [undefined, undefined, undefined];
  const minGapPx = CHIP.w + 6;

  for (const c of sorted) {
    let lane: 0|1|2 = 0;
    let angle = c.angle;
    let r = rBase;

    const tryLane = (L: 0|1|2) => {
      const R = rBase - L * rGap;
      const prev = last[L];
      const collide = prev ? (Math.abs(angle - prev.angle) * R) < minGapPx : false;
      return { collide, R, prev };
    };

    let t = tryLane(0);
    if (t.collide) { t = tryLane(1);
      if (t.collide) { t = tryLane(2);
        if (t.collide) { angle += 3 * DEG; }
        lane = 2; r = t.R;
      } else { lane = 1; r = t.R; }
    } else { lane = 0; r = t.R; }

    const pos = polar(r, angle);
    const placed: PlacedChip = { ...c, lane, r, angle, x: pos.x, y: pos.y };
    out.push(placed);
    last[lane] = placed;
  }

  // keep chips off exact cusps by ±3°
  const CUSP_AVOID = 3 * DEG;
  const cusps = Array.from({ length: 12 }, (_, i) => (i * 30) * DEG);
  for (const ch of out) {
    for (const ca of cusps) {
      const d = Math.abs(((ch.angle - ca + Math.PI) % (2 * Math.PI)) - Math.PI);
      if (d < CUSP_AVOID) {
        ch.angle = ch.angle + (ch.angle >= ca ? 1 : -1) * CUSP_AVOID;
        const p = polar(ch.r, ch.angle);
        ch.x = p.x; ch.y = p.y;
        break;
      }
    }
  }

  return out;
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

  // size & radii
  const SIZE = Math.max(260, Math.min(availableWidth ?? 0, 560) || 320);
  const R = SIZE / 2;
  const { rOuter, rSigns, rZodiacTicks, rPlanetTrack, rPlanetLaneGap, rHouses, rInner1, rInner2 } =
    useMemo(() => RLAY(R), [R]);

  // Parse chip inputs from chart
  const chipInputs: PlanetChipInput[] = useMemo(() => {
    const pts: any[] =
      (chart as any)?.points ??
      (chart as any)?.positions ??
      (chart as any)?.planets ??
      [];

    return pts
      .map((p: any, idx: number) => {
        const body = p.point ?? p.body ?? {};
        const id = String(body.id ?? body.key ?? body.name ?? body.label ?? p.id ?? `P${idx}`);
        const lon = extractLonDeg(p);
        if (!isFiniteNum(lon)) return null;

        const glyph =
          PLANET_GLYPH[id] ??
          body.glyph ?? body.symbol ?? p.glyph ?? p.symbol ??
          (typeof id === 'string' ? id.charAt(0) : '•');

        const degInSign = extractDegInSign(p, lon);
        const degText = `${Math.round(degInSign * 10) / 10}°`;

        return { id, lon, glyph: String(glyph), degText };
      })
      .filter(Boolean) as PlanetChipInput[];
  }, [chart]);

  // Place chips on lanes (or empty if none)
  const chips = useMemo(
    () => (chipInputs.length ? placeChips(chipInputs, rPlanetTrack, rPlanetLaneGap) : []),
    [chipInputs, rPlanetTrack, rPlanetLaneGap]
  );

  const showNoDataHint = chipInputs.length === 0 || chips.length === 0;

  // font sizes
  const fsSign = Math.max(10, Math.round(SIZE * 0.040));
  const fsHouse = Math.max(11, Math.round(SIZE * 0.038));

  return (
    <View style={s.wrap}>
      {/* Legend toggle */}
      <View style={{ alignSelf: 'flex-end', marginRight: 8, marginBottom: 6 }}>
        <Pressable onPress={() => setShowLegend(v => !v)}>
          <Text style={{ color: '#80d0ff', fontSize: 14 }}>
            {showLegend ? 'Hide legend' : 'Show legend'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            <G x={R} y={R}>
              {/* Outer rings */}
              <Circle r={rOuter} stroke={COL.rim} strokeWidth={STROKE.rim} opacity={OP.rim} fill="none" />
              <Circle r={rInner1} stroke={COL.rim} strokeWidth={1} opacity={0.25} fill="none" />
              <Circle r={rInner2} stroke={COL.rim} strokeWidth={1} opacity={0.25} fill="none" />

              {/* Zodiac ticks (5°/10°/30°) */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const a = deg * DEG;
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
                    stroke={COL.houseMinor} strokeWidth={STROKE.houseMinor}
                    opacity={is30 ? OP.houseMajor : OP.houseMinor}
                  />
                );
              })}

              {/* 12 house spokes */}
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30) * DEG;
                const p1 = polar(rInner2, a);
                const p2 = polar(rOuter, a);
                return (
                  <Line
                    key={`hb-${i}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={COL.houseMajor} strokeWidth={STROKE.houseMajor}
                    opacity={OP.houseMajor}
                  />
                );
              })}

              {/* Zodiac sign glyphs (outer ring) */}
              {SIGN_GLYPHS.map((g, i) => {
                const a = (i * 30 + 15) * DEG;
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
                  >
                    {g}
                  </SvgText>
                );
              })}

              {/* House numerals */}
              {Array.from({ length: 12 }).map((_, i) => {
                const mid = (i * 30 + 15) * DEG;
                const pt = polar(rHouses * 0.85, mid);
                return (
                  <SvgText
                    key={`hn-${i}`}
                    x={pt.x}
                    y={pt.y}
                    fontSize={fsHouse * 1.2}
                    fill="#cfd8e3"
                    opacity={0.9}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {i + 1}
                  </SvgText>
                );
              })}

              {/* Planet chips (if any) */}
              {chips.map((ch) => {
                const x = ch.x - CHIP.w / 2;
                const y = ch.y - CHIP.h / 2;
                return (
                  <G key={`chip-${ch.id}`}>
                    <Rect
                      x={x} y={y} width={CHIP.w} height={CHIP.h}
                      rx={CHIP.rx} ry={CHIP.rx}
                      fill={CHIP.fill} opacity={CHIP.fillOp}
                      stroke={CHIP.stroke} strokeWidth={1} strokeOpacity={CHIP.strokeOp}
                    />
                    {/* inner separator */}
                    <Line
                      x1={x + 4}
                      y1={y + Math.floor(CHIP.h * 0.58)}
                      x2={x + CHIP.w - 4}
                      y2={y + Math.floor(CHIP.h * 0.58)}
                      stroke="#000" opacity={0.12} strokeWidth={1}
                    />
                    {/* glyph */}
                    <SvgText
                      x={ch.x}
                      y={y + CHIP.pad + CHIP.glyphFs}
                      fontSize={CHIP.glyphFs}
                      fill="#ffffff" opacity={0.95}
                      textAnchor="middle"
                    >
                      {ch.glyph}
                    </SvgText>
                    {/* degree */}
                    <SvgText
                      x={ch.x}
                      y={y + CHIP.h - CHIP.pad - 1}
                      fontSize={CHIP.degFs}
                      fill={CHIP.degColor} opacity={0.95}
                      textAnchor="middle"
                    >
                      {ch.degText}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </View>

        {/* Hint if no chips parsed (but wheel still visible) */}
        {showNoDataHint && (
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ color: '#cfd8e3', textAlign: 'center', fontSize: 16 }}>
              No planet positions parsed.
            </Text>
            <Text style={{ color: '#8fb8ff', textAlign: 'center', marginTop: 6, fontSize: 12 }}>
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
    </View>
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
  legendWrap: {
    position: 'relative',
    alignSelf: 'stretch',
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: '#121821',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a3442',
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
});
