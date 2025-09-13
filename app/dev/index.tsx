import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function DevHub() {
  const router = useRouter();
  if (!__DEV__) return null; // never ships

  return (
    <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Dev Hub</Text>
      <Button title="Open ▶ Birth Profile form" onPress={() => router.push('/profile/birth')} />
    </View>
  );
}
