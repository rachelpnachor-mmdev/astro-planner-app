import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import { computeArchetypeProfile } from "../ai/archetype";
import type { ArchetypeProfile } from "../types/archetype";


const PROFILE_DIR = new Directory(Paths.document, "profile");
const ARCHETYPE_FILE = new File(PROFILE_DIR, "archetype.json");
const WEB_KEY = "lunaria/profile/archetype";


function ensureProfileDir(): void {
  try {
    if (!PROFILE_DIR.exists) PROFILE_DIR.create();
  } catch {
    // silent
  }
}

export async function saveArchetypeProfile(data: ArchetypeProfile): Promise<void> {
  if (Platform.OS === "web") {
    try { window.localStorage.setItem(WEB_KEY, JSON.stringify(data)); } catch {}
    return;
  }
  ensureProfileDir();
  try {
    ARCHETYPE_FILE.write(JSON.stringify(data));
  } catch {
    // silent
  }
}

export async function loadArchetypeProfile(): Promise<ArchetypeProfile | null> {
  if (Platform.OS === "web") {
    try {
      const raw = window.localStorage.getItem(WEB_KEY);
      return raw ? (JSON.parse(raw) as ArchetypeProfile) : null;
    } catch { return null; }
  }
  try {
    if (!ARCHETYPE_FILE.exists) return null;
    const raw = ARCHETYPE_FILE.textSync();
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
