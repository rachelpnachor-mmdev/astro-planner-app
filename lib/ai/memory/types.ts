export type MemoryTopic =
  | 'profile'
  | 'preferences'
  | 'astro'
  | 'rituals'
  | 'journal'
  | 'inventory'
  | 'family'
  | 'health'
  | 'work'
  | 'goals'
  | 'other';

export type MemoryEntry = {
  id: string;                 // e.g., `${timestamp}-${rand}`
  topic: MemoryTopic;
  content: string;            // user-facing text or compact JSON stringified
  createdAt: number;          // Date.now()
  updatedAt?: number;
  tags?: string[];
  // reserved for future vector search (optional at write time)
  embedding?: number[] | null;
};

export type TopicIndexItem = {
  topic: MemoryTopic;
  count: number;
  lastUpdated: number;
};

export type TopicIndex = {
  topics: TopicIndexItem[];
};

export type RecencyIndexItem = {
  id: string;
  topic: MemoryTopic;
  createdAt: number;
};

export type RecencyIndex = RecencyIndexItem[];

export type SaveMemoryInput = {
  topic: MemoryTopic;
  content: string;
  tags?: string[];
  embedding?: number[] | null;
};

export type RetrieveOptions = {
  topics?: MemoryTopic[];
  limit?: number;         // default 10
  query?: string;         // keyword search (fallback if no vectors)
  since?: number;         // optional ts filter
};
