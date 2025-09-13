import * as FileSystem from 'expo-file-system';
import { PushBatch, PushResult } from './types';
const documentDirectory = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory;

const OUTBOX_DIR = `${documentDirectory}cloud_outbox/`;
const BASE_URL = process.env.EXPO_PUBLIC_SYNC_URL; // e.g., https://api.yourapp.com

async function ensureOutbox() {
  const info = await FileSystem.getInfoAsync(OUTBOX_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(OUTBOX_DIR, { intermediates: true });
}

export async function pushViaRemote(batch: PushBatch): Promise<PushResult> {
  if (!BASE_URL) throw new Error('No EXPO_PUBLIC_SYNC_URL configured');
  const res = await fetch(`${BASE_URL.replace(/\/$/,'')}/sync/push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch),
  });
  const ok = res.ok;
  let topicsPushed: PushResult['topicsPushed'] = [];
  try {
    const data = await res.json();
    topicsPushed = data?.topicsPushed ?? [];
  } catch {}
  return { ok, status: res.status, topicsPushed, error: ok ? undefined : 'Remote push failed' };
}

export async function pushViaFileSink(batch: PushBatch): Promise<PushResult> {
  await ensureOutbox();
  const ts = batch.generatedAt.replace(/[:.]/g,'-');
  const fname = `${OUTBOX_DIR}push-${ts}.json`;
  await FileSystem.writeAsStringAsync(fname, JSON.stringify(batch, null, 2));
  const topicsPushed = batch.batch.map(b => ({
    topic: b.topic, count: b.entries.length,
    maxCreatedAt: b.entries.reduce((m, e) => Math.max(m, e.createdAt), 0)
  }));
  return { ok: true, topicsPushed };
}
