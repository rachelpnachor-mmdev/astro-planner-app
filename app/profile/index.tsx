import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BirthProfileSection from '../../components/BirthProfileSection';
import StarfieldBackground from '../../components/StarfieldBackground';
import { getCurrentUser } from '../../lib/authSession';
import { assignArchetypeProfile, loadArchetypeProfile } from '../../lib/profile/archetype';
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
        console.warn('[LUNARIA][triage] archetype profile saved', profile);
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
});

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);

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

        <BirthProfileSection />

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
    </View>
  );
}
