import * as FileSystem from 'expo-file-system';

import {
    cacheDirectory,
    deleteAsync,
    documentDirectory,
    getInfoAsync,
    hasFS,
    makeDirectoryAsync,
    readDirectoryAsync,
} from '../../utils/fsCompat';

import { RECENCY_INDEX, TOPIC_INDEX, TOPIC_SHARD } from './paths';
import { rankByKeywordAndRecency } from './retrieval';

import type {
    MemoryEntry,
    MemoryTopic,
    RecencyIndex,
    RetrieveOptions,
    SaveMemoryInput,
    TopicIndex,
    TopicIndexItem,
} from './types';
// === Memory directories (account-local) ===
const MEMORY_DIR = `${(documentDirectory ?? cacheDirectory) as string}lunaria/ai/`;
const SHARDS_DIR = `${MEMORY_DIR}shards/`;
const JOURNAL_DIR = `${MEMORY_DIR}journal/`;
const TOPICS_DIR = `${MEMORY_DIR}topics/`;

export async function ensureDirs(): Promise<void> {
  if (!hasFS) return;
  const mk = async (dir: string) => {
    const info = await getInfoAsync(dir);
    if (!info.exists) {
      await makeDirectoryAsync(dir, { intermediates: true });
    }
  };
  await mk(MEMORY_DIR);
  await mk(SHARDS_DIR);
  await mk(JOURNAL_DIR);
  await mk(TOPICS_DIR);
}


function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readString(path: string): Promise<string | null> {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    return await FileSystem.readAsStringAsync(path);
  } catch { return null; }
}

async function writeString(path: string, data: string): Promise<void> {
  await FileSystem.writeAsStringAsync(path, data);
}

async function appendLine(path: string, line: string): Promise<void> {
  const current = (await readString(path)) ?? '';
  const next = current.length ? `${current}\n${line}` : line;
  await writeString(path, next);
}

async function loadTopicIndex(): Promise<TopicIndex> {
  const raw = await readString(TOPIC_INDEX);
  if (!raw) return { topics: [] };
  try { return JSON.parse(raw) as TopicIndex; } catch { return { topics: [] }; }
}

async function saveTopicIndex(idx: TopicIndex): Promise<void> {
  await writeString(TOPIC_INDEX, JSON.stringify(idx));
}

async function loadRecencyIndex(): Promise<RecencyIndex> {
  const raw = await readString(RECENCY_INDEX);
  if (!raw) return [];
  try { return JSON.parse(raw) as RecencyIndex; } catch { return []; }
}

async function saveRecencyIndex(idx: RecencyIndex): Promise<void> {
  // keep it from growing unbounded (cap recent list)
  const capped = idx.slice(-2000);
  await writeString(RECENCY_INDEX, JSON.stringify(capped));
}

export async function saveMemory(input: SaveMemoryInput): Promise<MemoryEntry> {
  await ensureDirs();

  const entry: MemoryEntry = {
    id: uid(),
    topic: input.topic,
    content: input.content,
    createdAt: Date.now(),
    tags: input.tags,
    embedding: input.embedding ?? null,
  };

  // 1) append JSONL to topic shard
  const shardPath = TOPIC_SHARD(input.topic);
  await appendLine(shardPath, JSON.stringify(entry));

  // 2) update topic index
  const tIndex = await loadTopicIndex();
  const found = tIndex.topics.find(t => t.topic === input.topic);
  if (found) {
    found.count += 1;
    found.lastUpdated = entry.createdAt;
  } else {
    tIndex.topics.push({ topic: input.topic, count: 1, lastUpdated: entry.createdAt } as TopicIndexItem);
  }
  await saveTopicIndex(tIndex);

  // 3) update recency index
  const rIndex = await loadRecencyIndex();
  rIndex.push({ id: entry.id, topic: entry.topic, createdAt: entry.createdAt });
  await saveRecencyIndex(rIndex);

  return entry;
}

export async function getShardEntries(topic: MemoryTopic): Promise<MemoryEntry[]> {
  await ensureDirs();
  const shardPath = TOPIC_SHARD(topic);
  const raw = await readString(shardPath);
  if (!raw) return [];
  // JSONL parse
  const lines = raw.split('\n').filter(Boolean);
  const parsed: MemoryEntry[] = [];
  for (const line of lines) {
    try { parsed.push(JSON.parse(line)); } catch {}
  }
  return parsed;
}

export async function retrieveMemory(opts: RetrieveOptions = {}): Promise<MemoryEntry[]> {
  await ensureDirs();
  const topics = opts.topics;
  const limit = opts.limit ?? 10;

  let pool: MemoryEntry[] = [];

  if (topics?.length) {
    for (const t of topics) {
      const entries = await getShardEntries(t);
      pool.push(...entries);
    }
  } else {
    // no topic filter → load the most recent across all topics by peeking recency index
    // then hydrate by reading the shards for those topics (cheap for small caps)
    const rIndex = await loadRecencyIndex();
    const recent = rIndex.slice(-500); // rolling window
    const byTopic = new Map<MemoryTopic, string[]>();
    for (const r of recent) {
      if (!byTopic.has(r.topic)) byTopic.set(r.topic, []);
      byTopic.get(r.topic)!.push(r.id);
    }
    for (const [topic] of byTopic) {
      const entries = await getShardEntries(topic);
      pool.push(...entries);
    }
  }

  // rank
  const ranked = rankByKeywordAndRecency(pool, opts.query, limit);
  return ranked.slice(0, limit);
}

export async function exportAllMemory(): Promise<{
  byTopic: Record<string, MemoryEntry[]>;
  topicIndex: TopicIndex;
  recency: RecencyIndex;
}> {
  await ensureDirs();
  const topicIdx = await loadTopicIndex();
  const byTopic: Record<string, MemoryEntry[]> = {};
  for (const t of topicIdx.topics) {
    byTopic[t.topic] = await getShardEntries(t.topic as any);
  }
  const recency = await loadRecencyIndex();
  return { byTopic, topicIndex: topicIdx, recency };
}

export async function clearAllMemory(): Promise<void> {
  await ensureDirs();
  // wipe shards by recreating dirs
  const shards: string[] = await readDirectoryAsync(TOPICS_DIR);
  await Promise.all(
    shards.map((name: string) => deleteAsync?.(TOPICS_DIR + name, { idempotent: true } as any))
  );
  await FileSystem.deleteAsync(TOPIC_INDEX, { idempotent: true });
  await FileSystem.deleteAsync(RECENCY_INDEX, { idempotent: true });
}
