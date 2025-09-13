import type { MemoryEntry, MemoryTopic } from '../memory/types';
import { getShardEntries } from '../memory';
import { PushBatch } from './types';

export async function buildPushBatch(
  deviceId: string,
  userEmail: string | null,
  cursors: Partial<Record<MemoryTopic, number>>,
  limitPerTopic = 200
): Promise<PushBatch> {
  const topics: MemoryTopic[] = [
    'profile','preferences','astro','rituals','journal','inventory','family','health','work','goals','other'
  ];
  const batch: PushBatch = {
    deviceId, userEmail,
    generatedAt: new Date().toISOString(),
    cursors,
    batch: [],
  };

  for (const topic of topics) {
    const last = cursors[topic] ?? 0;
    const entries = await getShardEntries(topic);
    const pending = entries
      .filter(e => e.createdAt > last)
      .sort((a,b) => a.createdAt - b.createdAt)
      .slice(0, limitPerTopic);
    if (pending.length) {
      // strip heavy fields if any (keep core)
      const minimal: MemoryEntry[] = pending.map(e => ({
        id: e.id, topic: e.topic, content: e.content, createdAt: e.createdAt, tags: e.tags, embedding: null
      }));
      batch.batch.push({ topic, entries: minimal });
    }
  }
  return batch;
}
