// Import userStore for saving chart
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { BirthChart } from '../../lib/astro/types';
import { getProfileChart, setProfileChart } from '../../lib/userStore'; // Adjust path if needed
import BirthChartTable from './BirthChartTable';
import BirthChartWheel from './BirthChartWheel';
import { LunariaColors } from '../../constants/Colors';

type Props = {
  chart?: BirthChart | null;
  loading?: boolean;
};

export default function ChartView({ chart, loading }: Props) {
  const pagerRef = useRef<ScrollView>(null);
  const [tab, setTab] = useState(0);
  const { width: pageWidth } = useWindowDimensions();
  // Measure the actual inner width of the pager frame (accounts for any parent padding)
  const [frameWidth, setFrameWidth] = useState<number | null>(null);
  const W = frameWidth ?? Math.round(pageWidth);

  // DEV: read back proof of persisted chart (runs unconditionally)
  useEffect(() => {
    if (!__DEV__) return;
    (async () => {
      try {
        const getter = (typeof getProfileChart === 'function') ? getProfileChart : undefined;
        if (!getter) {
          console.log('[ChartView] getProfileChart unavailable (skipping read-back)');
          return;
        }
        const saved = await getter();
        console.log('[ChartView] saved profileChart birth', saved?.birth);
        const savedMoon = saved?.points?.find?.((p:any)=> p.point==='Moon' || p.body==='Moon');
        console.log('[ChartView] saved Moon raw', savedMoon?.ecliptic);
      } catch (e) {
        console.log('[ChartView] read-back error', String(e));
      }
    })();
  }, [chart]);

  if (loading) return <ActivityIndicator />;

  if (!chart) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
          No chart data available
        </Text>
        <Text style={{ color: LunariaColors.text, fontSize: 14, textAlign: 'center' }}>
          Please complete your birth profile to view your chart
        </Text>
      </View>
    );
  }

  // DEV: prove this is the profile chart we think it is
  if (__DEV__) {
    console.log('[ChartView] chart meta.source', (chart as any)?.meta?.source);
    console.log('[ChartView] chart.birth', (chart as any)?.birth);
    console.log('[ChartView] points[0..3]', (chart as any)?.points?.slice?.(0,3));
    const moon = (chart as any)?.points?.find?.((p:any)=> p.point==='Moon' || p.body==='Moon');
    console.log('[ChartView] Moon raw (pre-wheel)', moon?.ecliptic);
  }

  // persist exact instance (fire-and-forget)
  setProfileChart(chart);

  return (
    <View style={styles.root}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          onPress={() => {
            setTab(0);
            pagerRef.current?.scrollTo({ x: 0, animated: true });
          }}
          style={[styles.tab, tab === 0 && styles.tabActive]}
          accessibilityRole="button"
        >
          <Text style={styles.tabText}>Chart</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setTab(1);
            pagerRef.current?.scrollTo({ x: W, animated: true });
          }}
          style={[styles.tab, tab === 1 && styles.tabActive]}
          accessibilityRole="button"
        >
          <Text style={styles.tabText}>Table</Text>
        </Pressable>
      </View>

      {/* Pager Frame: measures width and clips neighbors */}
      <View style={styles.pagerFrame} onLayout={(e) => setFrameWidth(Math.round(e.nativeEvent.layout.width))}>
        <ScrollView
          horizontal
          pagingEnabled
          bounces={false}
          decelerationRate="fast"
          snapToInterval={W}
          snapToAlignment="start"
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          ref={pagerRef}
          onScroll={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / W);
            if (idx !== tab) setTab(idx);
          }}
          scrollEventThrottle={16}
        >
          {/* Page 1: Wheel (no horizontal padding; width == W) */}
          <View style={{ width: W, paddingVertical: 12, alignItems: 'center' }}>
            <BirthChartWheel chart={chart} availableWidth={W * 1.1} />
          </View>
          {/* Page 2: Table (no horizontal padding; width == W) */}
          <View style={{ width: W, paddingVertical: 12 }}>
            <BirthChartTable chart={chart} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }, // transparent so Starfield shows through
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  tab: { backgroundColor: LunariaColors.card, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  tabActive: { borderWidth: 1, borderColor: '#2d76ff' },
  tabText: { color: 'white', fontSize: 14, fontWeight: '600' },
  pagerFrame: { alignSelf: 'stretch', overflow: 'hidden' }, // clip neighbors precisely
});
