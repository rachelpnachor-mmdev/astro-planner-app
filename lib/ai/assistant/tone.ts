import { loadArchetypeProfile } from '../archetype/archetype';

export type ToneDirectives = {
  archetype: string;
  directive: string;
};

export async function buildToneDirectives(): Promise<ToneDirectives> {
  const profile = await loadArchetypeProfile();
  const fallback = { archetype: 'Default', tone_guidelines: { assertiveness: 0.5, warmth: 0.6, structure: 0.6, playfulness: 0.5 } };
  const p = profile ?? fallback;

  const t = p.tone_guidelines;
  const as = (n: number) => (n < 0.35 ? 'low' : n > 0.7 ? 'high' : 'balanced');

  const directive =
    `You are the "${p.archetype}" archetype. Keep replies ${as(t.assertiveness)}-assertive, ` +
    `${as(t.warmth)}-warm, ${as(t.structure)}-structured, and ${as(t.playfulness)}-playful. ` +
    `Be consistent and concise.`;

  return { archetype: p.archetype, directive };
}
