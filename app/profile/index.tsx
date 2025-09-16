// app/profile/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import BirthChartTable from '../../components/astro/BirthChartTable';
import BirthChartWheel from '../../components/astro/BirthChartWheel';
import StarfieldBackground from '../../components/StarfieldBackground';
import { useBirthChart } from '../../lib/astro/useBirthChart';
import { loadBirthProfile } from '../../lib/profile/birth';

// Hide native header
export const options = { headerShown: false, title: 'Profile' };

type BirthProfile = {
  name?: string;
  birthDate?: string;     // 'YYYY-MM-DD'
  birthTime?: string;     // 'HH:mm'
  timezone?: string;      // IANA
  birthplace?: string;    // free text
  // tolerate alt keys too (so this file stays robust)
  timeZone?: string;
  tz?: string;
  date?: string;
  time?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Birth chart modal state
  const [showChartModal, setShowChartModal] = useState(false);
  const pagerRef = useRef<ScrollView>(null);
  const [tab, setTab] = useState(0);
  const { width: pageWidth } = useWindowDimensions();

  // Chart data (hook computes from saved profile + settings)
  const { chart, loading: loadingChart } = useBirthChart();

  useEffect(() => {
    (async () => {
      try {
        const p = await loadBirthProfile();
        setProfile(p ?? {});
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  const onCancel = () => {
    // history-aware cancel
    // @ts-expect-error expo-router may expose canGoBack at runtime
    if ((router as any)?.canGoBack?.()) router.back();
    else router.replace('/');
  };

  // Safe accessors for display (tolerate slightly different keys)
  const name = profile?.name || '';
  const birthDate = profile?.birthDate || profile?.date || '';
  const birthTime = profile?.birthTime || profile?.time || '';
  const timezone = profile?.timezone || profile?.timeZone || profile?.tz || '';
  const birthplace = profile?.birthplace || '';

  return (
    <View style={styles.root}>
      <StarfieldBackground />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.h1}>Profile</Text>
          <Pressable onPress={onCancel} accessibilityRole="button">
            <Text style={styles.linkText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Birth Profile card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>Birth Profile</Text>
            <Pressable
              onPress={() => router.push('/profile/edit')}
              accessibilityRole="button"
            >
              <Text style={styles.cardLink}>Edit</Text>
            </Pressable>
          </View>

          {loadingProfile ? (
            <ActivityIndicator />
          ) : (
            <>
              {name ? <Row label="Name" value={name} /> : null}
              {birthDate ? <Row label="Birth date" value={birthDate} /> : null}
              {birthTime ? <Row label="Birth time" value={birthTime} /> : null}
              {timezone ? <Row label="Timezone" value={timezone} /> : null}
              {birthplace ? <Row label="Birthplace" value={birthplace} /> : null}

              <Pressable
                onPress={() => setShowChartModal(true)}
                accessibilityRole="button"
                style={styles.cardLinkWrap}
              >
                <Text style={styles.cardLink}>View Birth Chart</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* You can keep other cards (Account, Dev/QA) below as separate <View style={styles.card}> blocks */}
      </ScrollView>

      {/* Birth Chart Modal */}
      <Modal
        visible={showChartModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowChartModal(false)}
      >
        <View style={modalStyles.container}>
          <StarfieldBackground />

          <View style={modalStyles.topBar}>
            <Pressable onPress={() => setShowChartModal(false)} accessibilityRole="button">
              <Text style={modalStyles.closeText}>Done</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={modalStyles.tabs}>
            <Pressable
              onPress={() => {
                setTab(0);
                pagerRef.current?.scrollTo({ x: 0, animated: true });
              }}
              style={[modalStyles.tab, tab === 0 && modalStyles.tabActive]}
            >
              <Text style={modalStyles.tabText}>Chart</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTab(1);
                pagerRef.current?.scrollTo({ x: pageWidth, animated: true });
              }}
              style={[modalStyles.tab, tab === 1 && modalStyles.tabActive]}
            >
              <Text style={modalStyles.tabText}>Table</Text>
            </Pressable>
          </View>

          {/* Horizontal pager */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={pagerRef}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const idx = Math.round(x / pageWidth);
              if (idx !== tab) setTab(idx);
            }}
            scrollEventThrottle={16}
          >
            <View style={{ width: pageWidth, padding: 16 }}>
              {loadingChart || !chart ? (
                <ActivityIndicator />
              ) : (
                <BirthChartWheel chart={chart} />
              )}
            </View>
            <View style={{ width: pageWidth, padding: 16 }}>
              {loadingChart || !chart ? (
                <ActivityIndicator />
              ) : (
                <BirthChartTable chart={chart} />
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}:</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0f14' },
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h1: { color: 'white', fontSize: 28, fontWeight: '800' },
  linkText: { color: '#80d0ff', fontSize: 16 },

  card: { backgroundColor: '#121821', borderRadius: 12, padding: 16, gap: 10 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  cardLinkWrap: { paddingTop: 6 },
  cardLink: { color: '#80d0ff', fontSize: 15, fontWeight: '500' },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: '#cfd8e3', fontSize: 14 },
  rowValue: { color: '#ffffff', fontSize: 14 },
});

const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f14' },
  topBar: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, alignItems: 'flex-end' },
  closeText: { color: '#80d0ff', fontSize: 16, fontWeight: '600' },

  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  tab: { backgroundColor: '#121821', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  tabActive: { borderWidth: 1, borderColor: '#2d76ff' },
  tabText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
