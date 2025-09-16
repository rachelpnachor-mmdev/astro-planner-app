// components/astro/BirthChartTable.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { computeAspects, type Aspect } from '../../lib/astro/aspects';
import type { BirthChart } from '../../lib/astro/types';

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

export default function BirthChartTable({ chart }: { chart: BirthChart }) {
  const aspects: Aspect[] = computeAspects(chart.points);
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
      ) : aspects.map((a: Aspect, i: number) => (
        <View key={i} style={s.row}>
          <Text style={s.left}>{a.p1} – {a.p2}</Text>
          <Text style={s.right}>{a.type} • Δ {a.delta}°</Text>
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
