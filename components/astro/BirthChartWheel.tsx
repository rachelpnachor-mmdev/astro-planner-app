// components/astro/BirthChartWheel.tsx
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { ASPECT_COLORS, computeAspects, type Aspect } from '../../lib/astro/aspects';
import type { BirthChart } from '../../lib/astro/types';

const SIGN_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'] as const;
const PLANET_GLYPH: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};
const HOUSE_ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

type LineSeg = { x1: number; y1: number; x2: number; y2: number; color: string };

export default function BirthChartWheel(
  { chart, availableWidth }: { chart: BirthChart; availableWidth?: number }
) {
  // Size to the pager-provided width if available; otherwise fallback to window width.
  const win = useWindowDimensions();
  const baseW = typeof availableWidth === 'number' ? availableWidth : win.width;
  // Small inner margin to avoid clipping; cap for phones.
  const size = Math.max(260, Math.min(baseW - 24, 360));

  const rOuter = size / 2;
  const rInner = rOuter * 0.78;
  const rSign  = rOuter * 0.92;
  const rGlyph = rInner * 0.88;
  const rDeg   = rGlyph - 11;
  const rAspect = (rGlyph + rInner * 0.45) / 2;   // tidy intersections
  const rHouseLabel = rInner * 0.935;             // inside ring for readability
  const cx = rOuter, cy = rOuter;

  function polar(deg: number, r: number) {
    const a = ((-deg + 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  }
  const toLon = (signIndex: number, degree: number) => signIndex * 30 + degree;

  // Planets
  const planets = chart.points.map(p => ({
    key: p.point,
    label: PLANET_GLYPH[p.point] ?? p.point.slice(0,2),
    lon: toLon(p.ecliptic.signIndex, p.ecliptic.degree),
    degText: `${p.ecliptic.degree.toFixed(1)}°`,
  }));

  // Aspects
  const aspects: Aspect[] = computeAspects(chart.points);
  const lines: LineSeg[] = aspects.map((a) => {
    const p1 = planets.find(p => p.key === a.p1)!;
    const p2 = planets.find(p => p.key === a.p2)!;
    const A = polar(p1.lon, rAspect);
    const B = polar(p2.lon, rAspect);
    return { x1: A.x, y1: A.y, x2: B.x, y2: B.y, color: ASPECT_COLORS[a.type] };
  });

  // Houses (fallback to whole-sign cusps if missing)
  const rawCusps = (chart.houses?.cusps && chart.houses.cusps.length === 12)
    ? chart.houses.cusps
    : Array.from({ length: 12 }, (_, i) => ({ signIndex: i, degree: 0 }));
  const cusps = rawCusps.map((c, i) => ({ i, lon: toLon(c.signIndex, c.degree) }));
  const centers = cusps.map((c, i) => {
    const n = cusps[(i + 1) % 12];
    let span = (n.lon - c.lon + 360) % 360;
    if (!span) span = 30;
    return (c.lon + span / 2) % 360;
  });

  return (
    <View style={s.wrap}>
      <Svg width={size} height={size}>
        {/* rings */}
        <Circle cx={cx} cy={cy} r={rOuter} stroke="#2b3b53" strokeWidth={2} fill="#0b0f14" />
        <Circle cx={cx} cy={cy} r={rInner} stroke="#223046" strokeWidth={1} fill="#121821" />

        {/* ticks */}
        <G>
          {Array.from({ length: 72 }).map((_, i) => {
            const ang = i * 5;
            const major = ang % 30 === 0;
            const mid = !major && ang % 10 === 0;
            const len = major ? 14 : mid ? 9 : 5;
            const stroke = major ? '#3a5377' : '#2a3a55';
            const a = polar(ang, rInner + 2), b = polar(ang, rInner + 2 + len);
            return (
              <Line
                key={ang}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={stroke} strokeWidth={major ? 1.5 : 1} opacity={major ? 0.9 : 0.7}
              />
            );
          })}
        </G>

        {/* sign spokes + glyphs */}
        <G>
          {SIGN_GLYPHS.map((g, i) => {
            const ang = i * 30;
            const a = polar(ang, rInner);
            const m = polar(ang + 15, rSign);
            return (
              <G key={i}>
                <Line x1={a.x} y1={a.y} x2={cx} y2={cy} stroke="#222f45" strokeWidth={1} opacity={0.6}/>
                <SvgText x={m.x} y={m.y} fontSize={18} fill="#cfe2ff" stroke="#0b0f14" strokeWidth={0.75}
                  textAnchor="middle" alignmentBaseline="middle">{g}</SvgText>
              </G>
            );
          })}
        </G>

        {/* house cusps + numerals */}
        <G>
          {cusps.map(c => {
            const a = polar(c.lon, rInner), b = polar(c.lon, 0);
            return <Line key={c.i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2a3b55" strokeWidth={1} opacity={0.35} />;
          })}
          {centers.map((lon, i) => {
            const p = polar(lon, rHouseLabel);
            return (
              <SvgText
                key={i}
                x={p.x} y={p.y}
                fontSize={13} fill="#cfe2ff" stroke="#0b0f14" strokeWidth={0.75}
                textAnchor="middle" alignmentBaseline="middle"
              >
                {HOUSE_ROMAN[i]}
              </SvgText>
            );
          })}
        </G>

        {/* aspect lines */}
        <G>
          {lines.map((l, i) => (
            <Line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={1.15} opacity={0.7}/>
          ))}
        </G>

        {/* planets */}
        <G>
          {planets.map(p => {
            const pos = polar(p.lon, rGlyph);
            const txt = polar(p.lon, rDeg);
            return (
              <G key={p.key}>
                <SvgText x={pos.x} y={pos.y} fontSize={18} fill="#fff" stroke="#0b0f14" strokeWidth={0.75}
                  textAnchor="middle" alignmentBaseline="middle">{p.label}</SvgText>
                <SvgText x={txt.x} y={txt.y} fontSize={11} fill="#d6e2f3" stroke="#0b0f14" strokeWidth={0.5}
                  textAnchor="middle" alignmentBaseline="middle">{p.degText}</SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({
  // Width is controlled by parent page; keep centered.
  wrap: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
});
