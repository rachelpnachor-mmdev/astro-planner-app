import * as SecureStore from 'expo-secure-store';
// TEMP for one-release migration:
import AsyncStorage from '@react-native-async-storage/async-storage';
// ✅ Canonical type import only:
import type { BirthProfile } from './types/profile';

export type User = {
  id: string;
  email: string;
  password: string;
  profile?: {
    birth?: BirthProfile;
  };
};
// ✅ Single helper: attach/replace birth profile for a user by email
export async function setBirthProfileForUser(email: string, birth: BirthProfile): Promise<void> {
  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error('User not found');
  const prev = users[idx];
  users[idx] = {
    ...prev,
    profile: { ...(prev.profile ?? {}), birth },
  };
  await saveUsers(users);
}
// For legacy compatibility
export type DevUser = User;
const KEY = 'lunaria.users';
const MIGRATED_FLAG = 'lunaria.users.migrated';

// internal
async function migrateUsersIfNeeded() {
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

async function loadUsers(): Promise<User[]> {
  await migrateUsersIfNeeded();
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as DevUser[]; } catch { return []; }
}
async function saveUsers(users: User[]): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(Array.isArray(users) ? users : []));
}

// public
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await loadUsers();
  const e = email.trim().toLowerCase();
  return users.find(u => u.email.trim().toLowerCase() === e);
}
export async function addUser(email: string, password: string): Promise<User> {
  const users = await loadUsers();
  const e = email.trim().toLowerCase();
  if (users.some(u => u.email.trim().toLowerCase() === e)) throw new Error('E_EXISTS');
  const user: DevUser = { id: `u_${Date.now()}`, email, password };
  users.push(user);
  await saveUsers(users);
  if (__DEV__) console.log('[STORE] addUser saved count=', users.length);
  return user;
}

// DEBUG helpers

export async function getAllUsers(): Promise<User[]> { return loadUsers(); }
export async function resetUsers(): Promise<void> { await SecureStore.deleteItemAsync(KEY); }
