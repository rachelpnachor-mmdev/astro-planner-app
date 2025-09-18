// lib/userStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import type { BirthChart } from './astro/types';
import type { BirthProfile } from './types/profile';

/* =========================
   CHART STORAGE (AsyncStorage)
   ========================= */

const PROFILE_CHART_KEY = '@lunaria:profileChart';
let _profileChartMem: BirthChart | undefined;

function safeStringify(value: unknown) {
  const seen = new WeakSet();
  return JSON.stringify(value as any, (_k, v) => {
    if (typeof v === 'function') return undefined;
    if (v && typeof v === 'object') {
      if (seen.has(v)) return undefined;
      seen.add(v);
    }
    return v;
  });
}

export async function setProfileChart(chart: BirthChart): Promise<void> {
  _profileChartMem = chart;
  try {
    await AsyncStorage.setItem(PROFILE_CHART_KEY, safeStringify(chart));
  } catch (e) {
    if (__DEV__) console.log('[userStore] setProfileChart error', e);
  }
}

export async function getProfileChart(): Promise<BirthChart | undefined> {
  if (_profileChartMem) return _profileChartMem;
  try {
    const raw = await AsyncStorage.getItem(PROFILE_CHART_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as BirthChart;
    _profileChartMem = parsed;
    return parsed;
  } catch (e) {
    if (__DEV__) console.log('[userStore] getProfileChart error', e);
    return undefined;
  }
}

export async function clearProfileChart(): Promise<void> {
  _profileChartMem = undefined;
  try {
    await AsyncStorage.removeItem(PROFILE_CHART_KEY);
  } catch (e) {
    if (__DEV__) console.log('[userStore] clearProfileChart error', e);
  }
}

/* =========================
   USER STORAGE (SecureStore)
   ========================= */

export type User = {
  id: string;
  email: string;
  password: string;
  profile?: {
    birth?: BirthProfile;
  };
};

// Legacy compat
export type DevUser = User;

const USERS_KEY = 'lunaria.users';
const MIGRATED_FLAG = 'lunaria.users.migrated';

// Migrate any legacy AsyncStorage users -> SecureStore (once)
async function migrateUsersIfNeeded() {
  const migrated = await SecureStore.getItemAsync(MIGRATED_FLAG);
  if (migrated) return;

  const secureHas = await SecureStore.getItemAsync(USERS_KEY);
  if (secureHas) {
    await SecureStore.setItemAsync(MIGRATED_FLAG, '1');
    return;
  }

  try {
    const legacy = await AsyncStorage.getItem(USERS_KEY);
    if (legacy) {
      await SecureStore.setItemAsync(USERS_KEY, legacy);
      await SecureStore.setItemAsync(MIGRATED_FLAG, '1');
      await AsyncStorage.removeItem(USERS_KEY);
    }
  } catch {
    // no-op
  }
}

async function loadUsers(): Promise<User[]> {
  await migrateUsersIfNeeded();
  const raw = await SecureStore.getItemAsync(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DevUser[];
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await SecureStore.setItemAsync(USERS_KEY, JSON.stringify(Array.isArray(users) ? users : []));
}

/* =========================
   USER API
   ========================= */

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await loadUsers();
  const e = email.trim().toLowerCase();
  return users.find(u => u.email.trim().toLowerCase() === e);
}

export async function addUser(email: string, password: string): Promise<User> {
  const users = await loadUsers();
  const e = email.trim().toLowerCase();
  if (users.some(u => u.email.trim().toLowerCase() === e)) {
    throw new Error('E_EXISTS');
  }
  const user: DevUser = { id: `u_${Date.now()}`, email, password };
  users.push(user);
  await saveUsers(users);
  if (__DEV__) console.log('[STORE] addUser saved count=', users.length);
  return user;
}

// Attach/replace birth profile for a user by email
export async function setBirthProfileForUser(email: string, birth: BirthProfile): Promise<void> {
  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) throw new Error('User not found');
  const prev = users[idx];
  users[idx] = {
    ...prev,
    profile: { ...(prev.profile ?? {}), birth },
  };
  await saveUsers(users);
}

// Debug helpers
export async function getAllUsers(): Promise<User[]> { return loadUsers(); }
export async function resetUsers(): Promise<void> { await SecureStore.deleteItemAsync(USERS_KEY); }