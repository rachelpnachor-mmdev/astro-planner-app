import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { BirthProfile, loadBirthProfile } from '../lib/profile/birth';
const Colors = {
  card: '#141C2F',
  border: '#2A3447',
  text: '#E6EDF3',
  sub: '#8B96A8',
};

const S = StyleSheet.create({
  card: { backgroundColor: Colors.card, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: Colors.border },
  labelText: { color: Colors.sub, marginBottom: 6, fontWeight: '600' },
  title: { fontWeight: '600', fontSize: 16, marginBottom: 8, color: Colors.text },
  value: { color: Colors.text },
  empty: { color: Colors.sub, marginBottom: 8 },
});

export default function BirthProfileSection() {
  const router = useRouter();
  const [bp, setBp] = useState<BirthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const data = await loadBirthProfile();
        if (alive) {
          setBp(data);
          setLoading(false);
        }
      })();
      return () => { alive = false; };
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ marginVertical: 16 }} />;

  return (
    <View style={S.card}>
      <Text style={S.title}>Birth Profile</Text>
      {bp ? (
        <View>
          <Text style={S.labelText}><Text style={S.value}>Name:</Text> <Text style={S.value}>{bp.fullName}</Text></Text>
          <Text style={S.labelText}><Text style={S.value}>Birth date:</Text> <Text style={S.value}>{bp.dateISO}</Text></Text>
          <Text style={S.labelText}><Text style={S.value}>Birth time:</Text> <Text style={S.value}>{bp.timeUnknown ? 'Unknown' : bp.time24 || '—'}</Text></Text>
          <Text style={S.labelText}><Text style={S.value}>Timezone:</Text> <Text style={S.value}>{bp.timezone}</Text></Text>
          <Text style={S.labelText}><Text style={S.value}>Birthplace:</Text> <Text style={S.value}>{bp.locationText}</Text></Text>
        </View>
      ) : (
        <Text style={S.empty}>No birth profile saved.</Text>
      )}
      <Button title={bp ? 'Edit' : 'Add'} onPress={() => router.push('/profile/birth')} />
    </View>
  );
}
