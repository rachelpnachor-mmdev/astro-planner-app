// components/astro/ChartView.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BirthChart } from '../../lib/astro/types';

export default function ChartView({ chart }: { chart: BirthChart }) {
  return (
    <View style={styles.card}>
      <Text style={styles.h1}>Birth Chart</Text>
      <Text style={styles.row}>System: {chart.system}</Text>
      <Text style={styles.row}>House System: {chart.houses.system}</Text>
      <Text style={[styles.row, styles.mt]}>Points (fake demo):</Text>
      {chart.points.slice(0, 5).map(p => (
        <Text key={p.point} style={styles.pt}>
          {p.point}: sign {p.ecliptic.signIndex}, {p.ecliptic.degree.toFixed(2)}°
        </Text>
      ))}
      <Text style={[styles.row, styles.mtSmall]}>Computed: {new Date(chart.computedAt).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#121821', borderRadius: 12, padding: 16 },
  h1: { color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { color: 'white', fontSize: 14 },
  pt: { color: '#b9c7d9', fontSize: 13 },
  mt: { marginTop: 8 },
  mtSmall: { marginTop: 4 },
});
