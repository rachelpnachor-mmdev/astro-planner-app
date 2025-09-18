// components/astro/BirthChartTable.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BirthChart } from '../../lib/astro/types';
import { LunariaColors } from '../../constants/Colors';

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

export default function BirthChartTable({ chart }: { chart: BirthChart }) {
  if (!chart || !chart.points) {
    return (
      <View style={s.card}>
        <Text style={s.title}>Birth Chart</Text>
        <Text style={s.right}>No chart data available</Text>
      </View>
    );
  }

  return (
    <View style={s.card}>
      <Text style={s.title}>Positions</Text>
      <ScrollView style={s.scrollContainer} showsVerticalScrollIndicator={false}>
        {chart.points.map((p, idx) => {
          const safePoint = p?.point || `Point${idx}`;

          // PREFER API sign name over calculated sign (if available)
          const apiSignName = p?.ecliptic?.apiSignName || p?.ecliptic?.zodiac_sign;
          const safeApiSignName = (apiSignName && typeof apiSignName === 'string') ? apiSignName : null;

          // Use same logic as BirthChartWheel: prefer lonDeg, fallback to computed
          const lonDeg = Number(p?.ecliptic?.lonDeg);
          const hasValidLonDeg = Number.isFinite(lonDeg);

          let signIndex, degInSign, calculatedSignName;

          // Prefer API degree value, then existing, then calculated
          const apiDegInSign = Number(p?.ecliptic?.apiDegInSign);
          const existingDegInSign = Number(p?.ecliptic?.degInSign);

          if (Number.isFinite(apiDegInSign)) {
            degInSign = apiDegInSign;
          } else if (Number.isFinite(existingDegInSign)) {
            degInSign = existingDegInSign;
          } else if (hasValidLonDeg) {
            // Calculate from lonDeg as fallback
            degInSign = ((lonDeg % 30) + 30) % 30;
          } else {
            degInSign = 0;
          }

          if (hasValidLonDeg) {
            signIndex = Math.floor(lonDeg / 30) % 12;
            calculatedSignName = SIGNS[signIndex];
          } else {
            // Fallback to existing fields
            signIndex = p?.ecliptic?.signIndexAries0 ?? 0;
            calculatedSignName = SIGNS[signIndex];
          }

          // Prefer API sign name, fallback to calculated
          const signName = safeApiSignName || calculatedSignName || 'Unknown';
          const degreeValue = typeof degInSign === 'number' && !isNaN(degInSign) ? degInSign : 0;

          // Debug log any discrepancies between API and calculated signs
          if (__DEV__ && safeApiSignName && calculatedSignName && safeApiSignName !== calculatedSignName) {
            console.log(`[BirthChartTable] ${safePoint} sign mismatch: API="${safeApiSignName}" calculated="${calculatedSignName}" lonDeg=${lonDeg}`);
          }

          // Alternating row colors: even rows use current color, odd rows are lighter
          const isEvenRow = idx % 2 === 0;
          const rowStyle = [s.row, isEvenRow ? s.rowEven : s.rowOdd];

          return (
            <View key={safePoint} style={rowStyle}>
              <Text style={s.left}>{safePoint}</Text>
              <Text style={s.right}>
                {signName} {degreeValue.toFixed(2)}°
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <Text style={s.updated}>
        Computed: {chart.computedAt
          ? (typeof chart.computedAt === 'number' || typeof chart.computedAt === 'string')
            ? new Date(chart.computedAt).toLocaleString()
            : 'Unknown'
          : 'Unknown'
        }
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: LunariaColors.card, borderRadius: 12, padding: 16, gap: 8 },
  title: { color: 'white', fontSize: 16, fontWeight: '700' },
  scrollContainer: {
    maxHeight: 500, // Increased height to show more content
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 1,
    borderRadius: 6,
  },
  rowEven: {
    backgroundColor: 'transparent', // Current background (no change)
  },
  rowOdd: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Slightly lighter for odd rows
  },
  left: { color: 'white', fontSize: 14, fontWeight: '500' },
  right: { color: LunariaColors.text, fontSize: 14 },
  updated: { color: LunariaColors.sub, fontSize: 12, marginTop: 8 },
});