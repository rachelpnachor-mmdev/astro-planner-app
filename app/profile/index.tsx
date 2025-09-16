// app/profile/index.tsx
// NOTE: No SplashScreen logic here. If you see a SplashScreen error, check your app entry point (App.tsx or _layout.tsx) for splash screen calls.
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import StarfieldBackground from '../../components/StarfieldBackground';
import { useBirthChart } from '../../lib/astro/useBirthChart';
import { getCurrentUser } from '../../lib/authSession';
import { assignArchetypeProfile, loadArchetypeProfile } from '../../lib/profile/archetype';
import { loadBirthProfile } from '../../lib/profile/birth';
import { findUserByEmail } from '../../lib/userStore';

// Hide native header on profile-like pages.
export const options = { headerShown: false, title: 'Profile' };

type BirthProfile = {
  name?: string;
  birthDate?: string;   // 'YYYY-MM-DD'
  birthTime?: string;   // 'HH:mm'
  timezone?: string;    // IANA tz id
  birthplace?: string;
  // tolerate alt keys for older saves
  date?: string; time?: string; timeZone?: string; tz?: string;
};

// ---------- helpers (top-level only) ----------
type AnyObj = Record<string, any>;
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const joinComma = (...parts: (string | undefined)[]) =>
  parts.filter((p) => !!p && p.trim().length > 0).join(', ');
const isoParts = (iso?: string) => {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: '', time: '' };
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return { date: `${y}-${m}-${dd}`, time: `${hh}:${mm}` };
};
function normalizeBirthProfile(raw: unknown): BirthProfile {
  const p = (raw ?? {}) as AnyObj;
  const fullName =
    str(p.name) ||
    str(p.fullName) ||
    [str(p.firstName), str(p.lastName)].filter(Boolean).join(' ').trim() ||
    str(p?.profile?.name) ||
    str(p?.birth?.name);

  const dateISO = str(p.dateISO) || str(p?.birth?.dateISO);
  let date = str(p.birthDate) || str(p.date) || str(p.dob) || str(p?.birth?.date) || '';
  let time = str(p.birthTime) || str(p.time) || str(p?.birth?.time) || '';
  if ((!date || !time) && dateISO) {
    const parts = isoParts(dateISO);
    if (!date) date = parts.date;
    if (!time) time = parts.time;
  }

  const timezone =
    str(p.timezone) || str(p.timeZone) || str(p.tz) ||
    str(p?.birth?.timezone) || str(p?.birth?.timeZone) || str(p?.birth?.tz);

  const birthplace =
    str(p.birthplace) ||
    str(p.place) ||
    str(p.locationText) ||
    str(p?.birth?.birthplace) ||
    str(p?.location?.name) ||
    joinComma(str(p.city), str(p.state || p.region), str(p.country));

  return {
    name: fullName || undefined,
    birthDate: date || undefined,
    birthTime: time || undefined,
    timezone: timezone || undefined,
    birthplace: birthplace || undefined,
    // keep tolerant alternates (no harm if present)
    date: str(p.date) || undefined,
    time: str(p.time) || undefined,
    timeZone: str(p.timeZone) || undefined,
    tz: str(p.tz) || undefined,
  };
}

// ------------------------------------------------

export default function ProfileScreen() {
  const router = useRouter();

  // Birth profile state
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Chart modal state
  const [showChartModal, setShowChartModal] = useState(false);

  // Lazy chart view (prevents route crash if chart module has issues)
  const [ChartView, setChartView] = useState<React.ComponentType<any> | null>(null);
  const [chartLoadError, setChartLoadError] = useState<string | null>(null);

  // Dev mode flag
  const SHOW_DEV_MENU =
    (typeof __DEV__ !== 'undefined' && __DEV__) ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SHOW_DEV_MENU === '1');

  // Compute chart (hook is already guarded)
  const { chart, loading: loadingChart } = useBirthChart();

  // Load birth profile from user store (if logged in) or secure store; then normalize
  useEffect(() => {
    (async () => {
      const session = await getCurrentUser();
      let birthProfile: unknown = null;
      if (session?.email) {
        const user = await findUserByEmail(session.email);
        birthProfile = user?.profile?.birth ?? null;
      }
      if (!birthProfile) {
        try {
          birthProfile = await loadBirthProfile();
        } catch {}
      }
      const normalized = normalizeBirthProfile(birthProfile);
       
      console.log('[LUNARIA][profile] normalized birth profile', normalized);
      setProfile(normalized);
      setLoadingProfile(false);
    })();
  }, []);

  // Lazy dynamic import for ChartView
  useEffect(() => {
    let cancelled = false;
    if (!showChartModal || ChartView) return;

    (async () => {
      try {
        const mod = await import('../../components/astro/ChartView');
        const Comp = (mod as any)?.default ?? null;
        if (!cancelled) {
          if (typeof Comp === 'function') {
            setChartView(() => Comp);
            setChartLoadError(null);
          } else {
            setChartLoadError('ChartView missing default export');
          }
        }
      } catch (err: any) {
        if (!cancelled) setChartLoadError(String(err?.message || err));
      }
    })();

    return () => { cancelled = true; };
  }, [showChartModal, ChartView]);


  const onCancel = useCallback(() => {
    const r: any = router as any;
    const canGoBack = typeof r?.canGoBack === 'function' ? r.canGoBack() : false;
    if (canGoBack && typeof r?.back === 'function') r.back();
    else router.replace('/');
  }, [router]);

  const onEditBirthProfile = useCallback(() => {
    // Route directly to /profile/birth; cast silences expo-router type union if needed.
    router.push('/profile/birth' as any);
  }, [router]);

  // Username tile
  const [username, setUsername] = useState<string>('—');
  useEffect(() => {
    (async () => {
      const session = await getCurrentUser();
      if (session?.email) {
        const user = await findUserByEmail(session.email);
        const up: any = user;
        if (up?.profile?.birth?.name) {
          setUsername(up.profile.birth.name as string);
        } else {
          setUsername(session.email);
        }
      }
    })();
  }, []);

  // Normalize fields for display (never hide the rows)
  const name = profile?.name || '—';
  const birthDate = profile?.birthDate || profile?.date || '—';
  const birthTime = profile?.birthTime || profile?.time || '—';
  const timezone = profile?.timezone || profile?.timeZone || profile?.tz || '—';
  // Use normalization logic for birthplace display
  const birthplace = (profile && normalizeBirthProfile(profile).birthplace) || '—';

  return (
    <View style={styles.root}>
      <StarfieldBackground />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top bar: Title + Cancel (right) */}
        <View style={styles.topBar}>
          <Text style={styles.h1}>Profile</Text>
          <Pressable onPress={onCancel} accessibilityRole="button">
            <Text style={styles.linkText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Username tile */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>Username</Text>
          </View>
          <Row label="Username" value={username} />
        </View>

        {/* Birth Profile card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>Birth Profile</Text>
            <Pressable onPress={onEditBirthProfile} accessibilityRole="button">
              <Text style={styles.cardLink}>Edit</Text>
            </Pressable>
          </View>

          {loadingProfile ? (
            <ActivityIndicator />
          ) : (
            <>
              <Row label="Name" value={name} />
              <Row label="Birth date" value={birthDate} />
              <Row label="Birth time" value={birthTime} />
              <Row label="Timezone" value={timezone} />
              <Row label="Birthplace" value={birthplace} />

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

        {/* Developer Tools (Archetype) */}
        {SHOW_DEV_MENU && (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardTitle}>Developer Tools</Text>
            </View>
            <Pressable
              style={{ paddingVertical: 8 }}
              onPress={async () => {
                try {
                  const SAMPLE_SIGNS = { rising: 'Aquarius', moon: 'Cancer', mars: 'Aquarius', venus: 'Scorpio' };
                  const ap = await assignArchetypeProfile(SAMPLE_SIGNS);
                   
                  console.log('[DEV][profile] Assign Archetype selected', ap);
                  alert(
                    `Archetype saved: ${ap.archetype}\n` +
                    `A:${ap.tone_guidelines.assertiveness.toFixed(2)} ` +
                    `W:${ap.tone_guidelines.warmth.toFixed(2)} ` +
                    `S:${ap.tone_guidelines.structure.toFixed(2)} ` +
                    `P:${ap.tone_guidelines.playfulness.toFixed(2)}`
                  );
                } catch {
                  alert('Error: Could not assign archetype profile.');
                }
              }}
            >
              <Text style={{ color: '#80d0ff', fontSize: 15 }}>Assign Archetype Profile (Sample)</Text>
            </Pressable>
            <Pressable
              style={{ paddingVertical: 8 }}
              onPress={async () => {
                try {
                  const ap = await loadArchetypeProfile();
                   
                  console.log('[DEV][profile] Load Archetype Profile selected', ap);
                  if (!ap) {
                    alert('No archetype profile found.');
                    return;
                  }
                  const t = ap.tone_guidelines;
                  alert(
                    `Archetype: ${ap.archetype}\n` +
                    `A:${t.assertiveness.toFixed(2)} ` +
                    `W:${t.warmth.toFixed(2)} ` +
                    `S:${t.structure.toFixed(2)} ` +
                    `P:${t.playfulness.toFixed(2)}`
                  );
                } catch {
                  alert('Error: Could not load archetype profile.');
                }
              }}
            >
              <Text style={{ color: '#80d0ff', fontSize: 15 }}>Load Archetype Profile</Text>
            </Pressable>
          </View>
        )}
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

          <View style={{ flex: 1, paddingTop: 4 }}>
            {!ChartView ? (
              chartLoadError ? (
                <View style={modalStyles.center}>
                  <Text style={modalStyles.errorText}>Couldn’t load chart view.</Text>
                  <Text style={modalStyles.errorSub}>{chartLoadError}</Text>
                </View>
              ) : (
                <View style={modalStyles.center}>
                  <ActivityIndicator />
                </View>
              )
            ) : (
              <ChartView chart={chart} loading={loadingChart} />
            )}
          </View>
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

  devHint: { color: '#cfdaea', fontSize: 13, paddingTop: 4 },
});

const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f14' },
  topBar: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, alignItems: 'flex-end' },
  closeText: { color: '#80d0ff', fontSize: 16, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#ffd1d1', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  errorSub: { color: '#cfdaea', fontSize: 13, textAlign: 'center', paddingHorizontal: 16 },
});
