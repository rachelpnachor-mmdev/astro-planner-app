import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lunaria.session'; // stores current user's email

export async function setCurrentUser(email: string) {
  await AsyncStorage.setItem(KEY, JSON.stringify({ email }));
}
export async function getCurrentUser(): Promise<{ email: string } | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as { email: string }; } catch { return null; }
}
export async function clearCurrentUser() {
  await AsyncStorage.removeItem(KEY);
}
