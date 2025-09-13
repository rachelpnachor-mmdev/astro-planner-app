import * as SecureStore from 'expo-secure-store';
// TEMP for one-release migration:
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lunaria.session'; // stores current user's email
const MIGRATED_FLAG = 'lunaria.session.migrated';

async function migrateSessionIfNeeded() {
  const migrated = await SecureStore.getItemAsync(MIGRATED_FLAG);
  if (migrated) return;
  const secureHas = await SecureStore.getItemAsync(KEY);
  if (secureHas) {
    await SecureStore.setItemAsync(MIGRATED_FLAG, '1');
    return;
  }
  try {
    const legacy = await AsyncStorage.getItem(KEY);
    if (legacy) {
      await SecureStore.setItemAsync(KEY, legacy);
      await SecureStore.setItemAsync(MIGRATED_FLAG, '1');
      await AsyncStorage.removeItem(KEY);
    }
  } catch {
    // no-op
  }
}

export async function setCurrentUser(email: string) {
  await SecureStore.setItemAsync(KEY, JSON.stringify({ email }));
}
export async function getCurrentUser(): Promise<{ email: string } | null> {
  await migrateSessionIfNeeded();
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as { email: string }; } catch { return null; }
}
export async function clearCurrentUser() {
  await SecureStore.deleteItemAsync(KEY);
}
