import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BirthProfileSection from '../../components/BirthProfileSection';
import StarfieldBackground from '../../components/StarfieldBackground';
import { getCurrentUser } from '../../lib/authSession';

const Colors = { bg: '#0B1220', text: '#E6EDF3' };
const S = StyleSheet.create({
  root: { flex: 1, position: 'relative', backgroundColor: Colors.bg },
  scroll: { backgroundColor: 'transparent' },
  container: { padding: 16, gap: 16, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
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
        <Text style={S.title}>Profile</Text>

        {email && (
          <View style={{ backgroundColor: 'rgba(20,28,47,0.9)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#2A3447' }}>
            <Text style={{ color: '#8B96A8', marginBottom: 6 }}>Account</Text>
            <Text style={{ color: Colors.text, fontWeight: '600' }}>{email}</Text>
          </View>
        )}

        <BirthProfileSection />
      </ScrollView>
    </View>
  );
}
