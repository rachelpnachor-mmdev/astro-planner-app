import { buildPushBatch } from './build';
import { loadSyncState, saveSyncState } from './state';
import { pushViaRemote, pushViaFileSink } from './transport';
import type { PushResult } from './types';

export async function runSyncPush(limitPerTopic = 200): Promise<PushResult & { skipped: boolean }> {
  const state = await loadSyncState();
  const batch = await buildPushBatch(state.deviceId, state.userEmail, state.cursor, limitPerTopic);

  if (!batch.batch.length) {
    return { ok: true, topicsPushed: [], skipped: true };
  }

  const useRemote = !!process.env.EXPO_PUBLIC_SYNC_URL;
  const result = useRemote ? await pushViaRemote(batch) : await pushViaFileSink(batch);

  if (result.ok) {
    // advance cursors per topic to max createdAt just pushed
    for (const group of batch.batch) {
      const max = group.entries.reduce((m, e) => Math.max(m, e.createdAt), 0);
      state.cursor[group.topic] = Math.max(state.cursor[group.topic] ?? 0, max);
    }
    state.lastPush = Date.now();
    await saveSyncState(state);
  }
  return { ...result, skipped: false };
}
