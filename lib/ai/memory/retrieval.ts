import { MemoryEntry } from './types';

// Simple fallback ranker: recency + keyword hits
export function rankByKeywordAndRecency(
  entries: MemoryEntry[],
  query?: string,
  limit: number = 10
): MemoryEntry[] {
  const q = (query ?? '').trim().toLowerCase();
  const scored = entries.map(e => {
    const ageMs = Date.now() - e.createdAt;
    const recencyScore = 1 / Math.max(1, ageMs / (1000 * 60 * 60)); // 1 per hour decay
    let keywordScore = 0;
    if (q) {
      const hay = [e.content, ...(e.tags ?? [])].join(' ').toLowerCase();
      if (hay.includes(q)) keywordScore = 1;
    }
    return { e, score: recencyScore + keywordScore };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.e);
}

// Hook point for future vector retrieval
export async function embedText(_text: string): Promise<number[] | null> {
  return null; // placeholder
}
