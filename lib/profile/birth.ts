import * as FileSystem from 'expo-file-system';

export type BirthProfile = {
  fullName: string;
  dateISO: string;          // YYYY-MM-DD
  time24?: string | null;   // HH:mm or null
  timeUnknown: boolean;
  timezone: string;         // IANA tz
  locationText: string;
  createdAt: number;
  updatedAt: number;
};

// ---- helpers: all lazy, no side effects at top-level ----
function getBaseDir(): string | null {
  // Prefer documentDirectory; fall back to cacheDirectory; may be null on web
  const fs: any = FileSystem;
  return fs.documentDirectory ?? fs.cacheDirectory ?? null;
}
function getProfileDir(): string | null {
  const base = getBaseDir();
  return base ? `${base}profile/` : null;
}
function getBirthFile(): string | null {
  const dir = getProfileDir();
  return dir ? `${dir}birth.json` : null;
}

async function ensureProfileDir(): Promise<boolean> {
  const dir = getProfileDir();
  if (!dir) return false;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return true;
}

// ---- public API ----
export async function loadBirthProfile(): Promise<BirthProfile | null> {
  const ok = await ensureProfileDir();
  if (!ok) return null; // no writable FS (e.g., web) → treat as empty
  const file = getBirthFile()!;
  try {
    const info = await FileSystem.getInfoAsync(file);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(file);
    return JSON.parse(raw) as BirthProfile;
  } catch {
    return null;
  }
}

export async function saveBirthProfile(
  input: Omit<BirthProfile, 'createdAt' | 'updatedAt'> & Partial<Pick<BirthProfile, 'createdAt'>>
): Promise<BirthProfile> {
  const ok = await ensureProfileDir();
  if (!ok) throw new Error('Local file storage unavailable on this platform');
  const now = Date.now();
  const prior = await loadBirthProfile();
  const data: BirthProfile = {
    ...input,
    createdAt: prior?.createdAt ?? input.createdAt ?? now,
    updatedAt: now,
  };
  const file = getBirthFile()!;
  await FileSystem.writeAsStringAsync(file, JSON.stringify(data, null, 2));
  return data;
}

export async function clearBirthProfile(): Promise<void> {
  const ok = await ensureProfileDir();
  if (!ok) return; // nothing to clear if no FS
  const file = getBirthFile()!;
  try { await FileSystem.deleteAsync(file, { idempotent: true }); } catch {}
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
