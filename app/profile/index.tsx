import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ChartView from '../../components/astro/ChartView';
import StarfieldBackground from '../../components/StarfieldBackground';
import { useBirthChart } from '../../lib/astro/useBirthChart';
import { getCurrentUser } from '../../lib/authSession';
import { assignArchetypeProfile, loadArchetypeProfile } from '../../lib/profile/archetype';
import { loadBirthProfile } from '../../lib/profile/birth';
import type { BirthProfile } from '../../lib/types/profile';
const SHOW_DEV_PANEL =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SHOW_DEV_MENU === '1');
  const SAMPLE_SIGNS = { rising: 'Aquarius', moon: 'Cancer', mars: 'Aquarius', venus: 'Scorpio' };

  async function devAssignSampleArchetype() {
    try {
      const profile = await assignArchetypeProfile(SAMPLE_SIGNS);
      const t = profile.tone_guidelines;
      Alert.alert(
        'Archetype saved',
        `${profile.archetype}\nA:${t.assertiveness.toFixed(2)}  W:${t.warmth.toFixed(2)}  S:${t.structure.toFixed(2)}  P:${t.playfulness.toFixed(2)}`
      );
    } catch (err) {
      Alert.alert('Error', 'Could not assign archetype profile.');
      console.warn('[LUNARIA][triage] assign archetype failed', err);
    }
  }

  async function devShowArchetype() {
    try {
      const profile = await loadArchetypeProfile();
      if (!profile) {
        Alert.alert('Archetype', 'No archetype profile found.');
        return;
      }
      const t = profile.tone_guidelines;
      Alert.alert(
        'Archetype',
        `${profile.archetype}\nA:${t.assertiveness.toFixed(2)}  W:${t.warmth.toFixed(2)}  S:${t.structure.toFixed(2)}  P:${t.playfulness.toFixed(2)}`
      );
        console.warn('[LUNARIA][triage] archetype profile loaded', profile);
    } catch (err) {
      Alert.alert('Error', 'Could not load archetype profile.');
        console.warn('[LUNARIA][triage] load archetype failed', err);
    }
  }

const Colors = { 
  bg: '#0B1220',
  card: '#141C2F',
  border: '#2A3447',
  text: '#E6EDF3',
  sub: '#8B96A8',
};
const S = StyleSheet.create({
  root: { flex: 1, position: 'relative', backgroundColor: Colors.bg },
  scroll: { backgroundColor: 'transparent' },
  container: { padding: 16, gap: 16, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, marginBottom: 6 },
  cancelLink: { color: Colors.text, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  card: { backgroundColor: Colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardLinkWrap: { paddingTop: 8 },
  cardLink: { color: '#80d0ff', fontSize: 15, fontWeight: '500' },
  labelText: { color: Colors.sub, marginBottom: 6, fontWeight: '600' },
  value: { color: Colors.text },
});

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const { chart, loading } = useBirthChart();
  const [showChartModal, setShowChartModal] = useState(false);
  const [birthProfile, setBirthProfile] = useState<BirthProfile | null>(null);

  useEffect(() => {
    (async () => {
      const bp = await loadBirthProfile();
      setBirthProfile(bp);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setEmail(u?.email ?? null);
    })();
  }, []);

  return (
    <View style={S.root}>
      <StarfieldBackground />
      <ScrollView contentContainerStyle={S.container} style={S.scroll}>
        <View style={S.toolbar}>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/");
            }}
            hitSlop={12}
          >
            <Text style={S.cancelLink}>Cancel</Text>
          </Pressable>
        </View>
        <Text style={S.title}>Profile</Text>

        {email && (
          <View style={S.card}>
            <Text style={{ color: Colors.sub, marginBottom: 6 }}>Account</Text>
            <Text style={{ color: Colors.text, fontWeight: '600' }}>{email}</Text>
          </View>
        )}


        {/* Chart preview removed; open modal instead via the button below */}
        <View style={S.card}>
          <View style={S.cardTopRow}>
          <Text style={S.title}>Birth Profile</Text>
          <Pressable onPress={() => router.push('/profile/birth')} accessibilityRole="button">
            <Text style={S.cardLink}>Edit</Text>
          </Pressable>
        </View>
        {/* Render birth profile fields or empty state */}
        <Text style={S.labelText}>
          <Text style={S.value}>Name:</Text> <Text style={S.value}>{birthProfile?.fullName ?? '—'}</Text>
        </Text>
        <Text style={S.labelText}>
          <Text style={S.value}>Birth date:</Text> <Text style={S.value}>{birthProfile?.dateISO ?? '—'}</Text>
        </Text>
        <Text style={S.labelText}>
          <Text style={S.value}>Birth time:</Text> <Text style={S.value}>{birthProfile?.timeUnknown ? 'Unknown' : birthProfile?.time24 ?? '—'}</Text>
        </Text>
        <Text style={S.labelText}>
          <Text style={S.value}>Timezone:</Text> <Text style={S.value}>{birthProfile?.timezone ?? '—'}</Text>
        </Text>
        <Text style={S.labelText}>
          <Text style={S.value}>Birthplace:</Text> <Text style={S.value}>{birthProfile?.locationText ?? '—'}</Text>
        </Text>
        <Pressable onPress={() => setShowChartModal(true)} accessibilityRole="button" style={S.cardLinkWrap}>
          <Text style={S.cardLink}>View Birth Chart</Text>
        </Pressable>
      </View>

        {SHOW_DEV_PANEL && (
          <View style={S.card}>
            <Text style={{ color: Colors.sub, marginBottom: 6 }}>Dev • Archetype QA</Text>
            <Pressable onPress={devAssignSampleArchetype} style={{ paddingVertical: 8 }}>
              <Text style={{ color: Colors.text, fontWeight: '600' }}>Assign Sample (Aquarius ↑ / Cancer ☾)</Text>
            </Pressable>
            <Pressable onPress={devShowArchetype} style={{ paddingVertical: 8 }}>
              <Text style={{ color: Colors.text, fontWeight: '600' }}>Show Current Archetype</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      {/* Modal for full-screen birth chart */}
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
          <ScrollView contentContainerStyle={modalStyles.content}>
            {loading || !chart ? <ActivityIndicator /> : <ChartView chart={chart} />}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f14' },
  topBar: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, alignItems: 'flex-end' },
  closeText: { color: '#80d0ff', fontSize: 16, fontWeight: '600' },
  content: { padding: 16, gap: 12 },
  viewLink: { paddingTop: 8 },
  viewLinkText: { color: '#80d0ff', fontSize: 15 },
});
