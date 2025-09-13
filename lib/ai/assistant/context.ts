import { retrieveMemory } from '../memory';
import type { MemoryTopic } from '../memory/types';

export function resolveTopicsFromInput(input: string): MemoryTopic[] {
  const s = input.toLowerCase();
  const topics: MemoryTopic[] = [];
  if (/(ritual|spell|altar|incense)/.test(s)) topics.push('rituals');
  if (/(journal|feel|mood)/.test(s)) topics.push('journal');
  if (/(astro|transit|moon|chart)/.test(s)) topics.push('astro');
  if (/(work|task|sprint|meeting)/.test(s)) topics.push('work');
  if (/(family|kid|partner|mom|dad|child)/.test(s)) topics.push('family');
  if (/(health|sleep|stress)/.test(s)) topics.push('health');
  if (/(crystal|inventory|apothecary)/.test(s)) topics.push('inventory');
  if (/(goal|plan|project|milestone)/.test(s)) topics.push('goals');
  if (!topics.length) topics.push('other');
  return topics;
}

export async function buildMemoryContext(input: string, limit = 8) {
  const topics = resolveTopicsFromInput(input);
  const hits = await retrieveMemory({ topics, limit, query: input });
  const lines = hits.map(h => `- ${new Date(h.createdAt).toISOString()}: [${h.topic}] ${h.content}`);
  const context = lines.length
    ? `Relevant notes:\n${lines.join('\n')}`
    : `Relevant notes: (none found)`;
  return { topics, hits, context };
}
