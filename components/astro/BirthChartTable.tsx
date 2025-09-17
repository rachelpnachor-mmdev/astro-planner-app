// components/astro/BirthChartTable.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { computeAspects, type AspectEdge } from '../../lib/astro/aspects';
import type { BirthChart } from '../../lib/astro/types';

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

export default function BirthChartTable({ chart }: { chart: BirthChart }) {
  // normalize a degree value into [0,360)
  const norm360 = (x: number) => ((x % 360) + 360) % 360;
  type Body = { id: string; lon: number };
  function toBodies(points: any[]): Body[] {
    return points
      .map((p, idx) => {
        const id: string =
          (p.id ?? p.key ?? p.name ?? p.label ?? `P${idx}`) + '';
        const lonRaw =
          p.lon ?? p.longitude ?? p.lambda ?? p.elon ?? p.deg ?? p.degree;
        const lon =
          typeof lonRaw === 'number'
            ? norm360(lonRaw)
            : Number.isFinite(parseFloat(lonRaw))
            ? norm360(parseFloat(lonRaw))
            : undefined;
        if (typeof lon !== 'number') return null;
        return { id, lon };
      })
      .filter(Boolean) as Body[];
  }
  const bodies = toBodies(chart.points || []);
  const aspects: AspectEdge[] = computeAspects(bodies);
  return (
    <View style={s.card}>
      <Text style={s.title}>Positions</Text>
      {chart.points.map(p => (
        <View key={p.point} style={s.row}>
          <Text style={s.left}>{p.point}</Text>
          <Text style={s.right}>
            {SIGNS[p.ecliptic.signIndex]} {p.ecliptic.degree.toFixed(2)}°
          </Text>
        </View>
      ))}

      <Text style={[s.title,{marginTop:12}]}>Aspects</Text>
      {aspects.length === 0 ? (
        <Text style={s.right}>None in orb</Text>
      ) : aspects.map((edge, i) => (
        <View key={`${edge.a}:${edge.b}:${edge.type}`} style={s.row}>
          <Text style={s.left}>{edge.a} 1 {edge.b}</Text>
          <Text style={s.right}>{edge.type} 2 94 {edge.delta.toFixed(1)}6</Text>
        </View>
      ))}

      <Text style={s.updated}>Computed: {new Date(chart.computedAt).toLocaleString()}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#121821', borderRadius: 12, padding: 16, gap: 8 },
  title: { color: 'white', fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  left: { color: 'white', fontSize: 14 },
  right: { color: '#cfdaea', fontSize: 14 },
  updated: { color: '#90a1b7', fontSize: 12, marginTop: 8 },
});
