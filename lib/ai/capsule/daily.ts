import { loadArchetypeProfile } from '../archetype/archetype';
import { retrieveMemory } from '../memory';

export type DailyCapsule = {
  date: string;
  archetype: string;
  theme: string;
  bullets: string[];
};

export async function buildDailyCapsule(): Promise<DailyCapsule> {
  const date = new Date().toISOString().slice(0,10);
  const arch = (await loadArchetypeProfile())?.archetype ?? 'Default';
  const recent = await retrieveMemory({ topics: ['astro','rituals','goals','journal'], limit: 8 });
  const bullets = recent.map(r => `[${r.topic}] ${r.content}`);
  const theme = `${arch}: focus small, consistent moves`;
  return { date, archetype: arch, theme, bullets };
}
