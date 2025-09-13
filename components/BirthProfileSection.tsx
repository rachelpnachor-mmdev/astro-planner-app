import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { BirthProfile, loadBirthProfile } from '../lib/profile/birth';

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
    <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee' }}>
      <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 8 }}>Birth Profile</Text>
      {bp ? (
        <View>
          <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: '600' }}>Name:</Text> {bp.fullName}</Text>
          <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: '600' }}>Birth date:</Text> {bp.dateISO}</Text>
          <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: '600' }}>Birth time:</Text> {bp.timeUnknown ? 'Unknown' : bp.time24 || '—'}</Text>
          <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: '600' }}>Timezone:</Text> {bp.timezone}</Text>
          <Text style={{ marginBottom: 4 }}><Text style={{ fontWeight: '600' }}>Birthplace:</Text> {bp.locationText}</Text>
        </View>
      ) : (
        <Text style={{ color: '#888', marginBottom: 8 }}>No birth profile saved.</Text>
      )}
      <Button title={bp ? 'Edit' : 'Add'} onPress={() => router.push('/profile/birth')} />
    </View>
  );
}
