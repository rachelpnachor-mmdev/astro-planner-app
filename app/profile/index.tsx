import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BirthProfileSection from '../../components/BirthProfileSection';
import StarfieldBackground from '../../components/StarfieldBackground';
import { getCurrentUser } from '../../lib/authSession';

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
      </ScrollView>
    </View>
  );
}
