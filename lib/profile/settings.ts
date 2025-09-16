import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Settings } from '../types/settings';

const SETTINGS_KEY = 'lunaria/settings';

export const defaultSettings: Settings = {
  features: { dailyCore: true, aiAssistant: true },
  astrology: { system: 'western', houseSystem: 'whole_sign' },
  notifications: { dailyCoreReminder: false },
  updatedAt: Date.now(),
};

// Web fallback wrappers
async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {}
}

export async function loadSettings(): Promise<Settings> {
  const raw = await getItemAsync(SETTINGS_KEY);
  if (!raw) return { ...defaultSettings, updatedAt: Date.now() };
  try {
    const parsed = JSON.parse(raw) as Settings;
    // Ensure shape (in case of older payloads)
    return {
      ...defaultSettings,
      ...parsed,
      features: { ...defaultSettings.features, ...(parsed.features ?? {}) },
      astrology: { ...defaultSettings.astrology, ...(parsed.astrology ?? {}) },
      notifications: { ...defaultSettings.notifications, ...(parsed.notifications ?? {}) },
      updatedAt: parsed.updatedAt ?? Date.now(),
    };
  } catch {
    return { ...defaultSettings, updatedAt: Date.now() };
  }
}

export async function saveSettings(next: Settings): Promise<void> {
  const payload = { ...next, updatedAt: Date.now() };
  await setItemAsync(SETTINGS_KEY, JSON.stringify(payload));
  // dev log (single, clearly-tagged)
   
  console.log('[LUNARIA][settings] saved', { updatedAt: payload.updatedAt });
}

type SettingsPatch = Partial<Settings> & {
  features?: Partial<Settings['features']>;
  astrology?: Partial<Settings['astrology']>;
  notifications?: Partial<Settings['notifications']>;
};

export async function updateSettings(patch: SettingsPatch): Promise<Settings> {
  const curr = await loadSettings();
  const next: Settings = {
    ...curr,
    ...patch,
    features: { ...curr.features, ...(patch.features ?? {}) },
    astrology: { ...curr.astrology, ...(patch.astrology ?? {}) },
    notifications: { ...curr.notifications, ...(patch.notifications ?? {}) },
    updatedAt: Date.now(),
  };
  await saveSettings(next);
  return next;
}
