import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { computeArchetypeProfile } from "../ai/archetype";
import type { ArchetypeProfile } from "../types/archetype";

const DIR = `${(FileSystem as any).documentDirectory || ""}profile`;
const FILE = `${DIR}/archetype.json`;
const WEB_KEY = "lunaria/profile/archetype";

async function ensureDir(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const info = await FileSystem.getInfoAsync(DIR);
    if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  } catch {
    // silent
  }
}

export async function saveArchetypeProfile(data: ArchetypeProfile): Promise<void> {
  if (Platform.OS === "web") {
    try { window.localStorage.setItem(WEB_KEY, JSON.stringify(data)); } catch {}
    return;
  }
  await ensureDir();
  await FileSystem.writeAsStringAsync(FILE, JSON.stringify(data));
}

export async function loadArchetypeProfile(): Promise<ArchetypeProfile | null> {
  if (Platform.OS === "web") {
    try {
      const raw = window.localStorage.getItem(WEB_KEY);
      return raw ? (JSON.parse(raw) as ArchetypeProfile) : null;
    } catch { return null; }
  }
  try {
    const info = await FileSystem.getInfoAsync(FILE);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(FILE);
    return raw ? (JSON.parse(raw) as ArchetypeProfile) : null;
  } catch {
    return null;
  }
}

/** Compute + persist in one call. */
export async function assignArchetypeProfile(input: {
  rising: string;
  moon: string;
  mars?: string;
  venus?: string;
}): Promise<ArchetypeProfile> {
  const profile = computeArchetypeProfile(input);
  await saveArchetypeProfile(profile);
  return profile;
}
