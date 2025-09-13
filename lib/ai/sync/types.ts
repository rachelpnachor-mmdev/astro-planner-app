import type { MemoryEntry, MemoryTopic } from '../memory/types';

export type SyncCursor = Partial<Record<MemoryTopic, number>>; // topic -> last pushed createdAt
export type SyncState = {
  deviceId: string;
  userEmail: string | null;
  lastPush: number | null;
  cursor: SyncCursor;
};

export type PushBatch = {
  deviceId: string;
  userEmail: string | null;
  generatedAt: string; // ISO
  cursors: SyncCursor;
  batch: {
    topic: MemoryTopic;
    entries: MemoryEntry[]; // minimally: id, content, topic, createdAt, tags?
  }[];
};

export type PushResult = {
  ok: boolean;
  status?: number;
  error?: string;
  topicsPushed: { topic: MemoryTopic; count: number; maxCreatedAt: number }[];
};