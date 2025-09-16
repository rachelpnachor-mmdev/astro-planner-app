// components/astro/ChartView.tsx
// Drop-in replacement so any existing <ChartView chart={...}/> now renders
// the new Wheel + Table tabs. No other files need to change.

import React, { useRef, useState } from 'react';
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
import BirthChartTable from './BirthChartTable';
import BirthChartWheel from './BirthChartWheel';

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

  if (loading || !chart) return <ActivityIndicator />;

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
            <BirthChartWheel chart={chart} availableWidth={W} />
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
  tab: { backgroundColor: '#121821', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  tabActive: { borderWidth: 1, borderColor: '#2d76ff' },
  tabText: { color: 'white', fontSize: 14, fontWeight: '600' },
  pagerFrame: { alignSelf: 'stretch', overflow: 'hidden' }, // clip neighbors precisely
});
