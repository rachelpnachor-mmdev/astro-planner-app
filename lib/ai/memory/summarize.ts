import * as FileSystem from 'expo-file-system';
import { SUMMARIES_DIR } from './paths';
import { MemoryEntry, MemoryTopic } from './types';

// Minimal stub: groups by week, concatenates brief bullets.
// Real LLM summarization can replace this later.
export async function summarizeWeekly(topic: MemoryTopic, entries: MemoryEntry[]): Promise<string> {
  const week = new Date().toISOString().slice(0, 10);
  const bullets = entries.slice(-20).map(e => `- ${new Date(e.createdAt).toISOString()}: ${e.content}`);
  const out = `# Weekly Summary (${topic}) – ${week}\n\n` + bullets.join('\n') + '\n';
  const path = `${SUMMARIES_DIR}${topic}-${week}.md`;
  await FileSystem.writeAsStringAsync(path, out);
  return path;
}
