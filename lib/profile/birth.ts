// Web storage helpers
import * as SecureStore from 'expo-secure-store';

import {
  cacheDirectory,
  deleteAsync,
  documentDirectory,
  EncodingType,
  getInfoAsync,
  hasFS,
  makeDirectoryAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from '../utils/fsCompat';

import type { BirthProfile } from '../types/profile';

async function webSet(key: string, value: string) {
  try {
    if (SecureStore.isAvailableAsync && (await SecureStore.isAvailableAsync())) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
  } catch (e) {
    console.warn('[birth:webSet] secure-store unavailable:', e);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
    return;
  }
  throw new Error('No web storage available');
}

async function webGet(key: string): Promise<string | null> {
  try {
    if (SecureStore.isAvailableAsync && (await SecureStore.isAvailableAsync())) {
      return await SecureStore.getItemAsync(key);
    }
  } catch (e) {
    console.warn('[birth:webGet] secure-store unavailable:', e);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return null;
}

async function webDelete(key: string) {
  try {
    if (SecureStore.isAvailableAsync && (await SecureStore.isAvailableAsync())) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
  } catch (e) {
    console.warn('[birth:webDelete] secure-store unavailable:', e);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  }
}
export type { BirthProfile } from '../types/profile';

// Silenced: No documentDirectory/cacheDirectory warning. Web fallback is expected and safe.

const PROFILE_DIR = `${(documentDirectory ?? cacheDirectory) as string}lunaria/profile/`;
const BIRTH_FILE = `${PROFILE_DIR}birth.json`;
const WEB_BIRTH_KEY = 'lunaria_profile_birth';

async function ensureProfileDir(): Promise<void> {
  if (!hasFS) return;
  const base = documentDirectory ?? cacheDirectory;
  if (!base) throw new Error('No writable FileSystem base dir');
  const info = await getInfoAsync(PROFILE_DIR);
  if (!info.exists) {
    await makeDirectoryAsync(PROFILE_DIR, { intermediates: true });
  }
}

export async function saveBirthProfile(
  payload: Omit<BirthProfile, 'createdAt' | 'updatedAt'>
): Promise<BirthProfile> {
  try {
    await ensureProfileDir();
    const now = Date.now();
    const data: BirthProfile = { ...payload, createdAt: now, updatedAt: now };
    if (hasFS) {
      await writeAsStringAsync(BIRTH_FILE, JSON.stringify(data), { encoding: EncodingType.UTF8 });
    } else {
      await webSet(WEB_BIRTH_KEY, JSON.stringify(data));
    }
    return data;
  } catch (e) {
    console.error('[saveBirthProfile] write failed:', e);
    throw e;
  }
}

export async function loadBirthProfile(): Promise<BirthProfile | null> {
  try {
    await ensureProfileDir();
    let raw: string | null = null;
    if (hasFS) {
      const info = await getInfoAsync(BIRTH_FILE);
      if (!info.exists) return null;
      raw = await readAsStringAsync(BIRTH_FILE, { encoding: EncodingType.UTF8 });
    } else {
      raw = await webGet(WEB_BIRTH_KEY);
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BirthProfile;
    } catch (e) {
      console.warn('[loadBirthProfile] JSON parse error, resetting file:', e);
      return null;
    }
  } catch (e) {
    console.error('[loadBirthProfile] failed:', e);
    return null;
  }
}

export async function clearBirthProfile(): Promise<void> {
  try {
    await ensureProfileDir();
    if (hasFS) {
      await deleteAsync?.(BIRTH_FILE, { idempotent: true } as any);
    } else {
      await webDelete(WEB_BIRTH_KEY);
    }
  } catch {}
}
// ---- lightweight validation helpers (unchanged) ----
export function isValidISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s + 'T00:00:00Z').getTime());
}
export function isValidTime(s: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}
export function defaultTimezone(): string {
  // @ts-ignore
  return Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone ?? 'UTC';
}
