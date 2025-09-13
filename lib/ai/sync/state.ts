import * as FileSystem from 'expo-file-system';
import { getCurrentUser } from '../../authSession';
import { PROFILE_DIR } from '../memory/paths';
import { SyncCursor, SyncState } from './types';

const SYNC_STATE = `${PROFILE_DIR}sync.json`;
const DEVICE_FILE = `${PROFILE_DIR}device.json`;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}

export async function ensureProfileDir() {
  const info = await FileSystem.getInfoAsync(PROFILE_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(PROFILE_DIR, { intermediates: true });
}

export async function ensureDeviceId(): Promise<string> {
  await ensureProfileDir();
  try {
    const info = await FileSystem.getInfoAsync(DEVICE_FILE);
    if (info.exists) {
      const raw = await FileSystem.readAsStringAsync(DEVICE_FILE);
      const obj = JSON.parse(raw);
      if (obj?.deviceId) return obj.deviceId as string;
    }
  } catch {}
  const deviceId = `lunaria-${uid()}`;
  await FileSystem.writeAsStringAsync(DEVICE_FILE, JSON.stringify({ deviceId }));
  return deviceId;
}

export async function loadSyncState(): Promise<SyncState> {
  await ensureProfileDir();
  const deviceId = await ensureDeviceId();
  const session = await getCurrentUser();
  try {
    const info = await FileSystem.getInfoAsync(SYNC_STATE);
    if (!info.exists) {
      return { deviceId, userEmail: session?.email ?? null, lastPush: null, cursor: {} as SyncCursor };
    }
    const raw = await FileSystem.readAsStringAsync(SYNC_STATE);
    const parsed = JSON.parse(raw) as SyncState;
    // keep deviceId and session fresh
    return { ...parsed, deviceId, userEmail: session?.email ?? parsed.userEmail ?? null };
  } catch {
    return { deviceId, userEmail: session?.email ?? null, lastPush: null, cursor: {} };
  }
}

export async function saveSyncState(state: SyncState) {
  await ensureProfileDir();
  await FileSystem.writeAsStringAsync(SYNC_STATE, JSON.stringify(state, null, 2));
}

export async function resetSyncState() {
  try { await FileSystem.deleteAsync(SYNC_STATE, { idempotent: true }); } catch {}
}
