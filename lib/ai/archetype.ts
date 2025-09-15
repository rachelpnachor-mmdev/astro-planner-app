import type { ArchetypeName, ArchetypeProfile, Element, ToneGuidelines } from "../types/archetype";

const SIGN_TO_ELEMENT: Record<string, Element> = {
  aries: "Fire", leo: "Fire", sagittarius: "Fire",
  taurus: "Earth", virgo: "Earth", capricorn: "Earth",
  gemini: "Air", libra: "Air", aquarius: "Air",
  cancer: "Water", scorpio: "Water", pisces: "Water",
};

function elementFromSign(sign: string): Element {
  const key = (sign || "").trim().toLowerCase();
  const el = SIGN_TO_ELEMENT[key];
  if (!el) throw new Error(`Unknown sign: ${sign}`);
  return el;
}

function baseArchetype(risingEl: Element, moonEl: Element): ArchetypeName {
  const t: Record<Element, Record<Element, ArchetypeName>> = {
    Fire:  { Fire: "Cheerleader", Earth: "Coach",      Air: "Spark",     Water: "Protector" },
    Earth: { Fire: "Driver",      Earth: "Guardian",   Air: "Architect", Water: "Guide" },
    Air:   { Fire: "Visionary",   Earth: "Strategist", Air: "Connector", Water: "Mirror" },
    Water: { Fire: "Healer",      Earth: "Anchor",     Air: "Dreamer",   Water: "Nurturer" },
  };
  return t[risingEl][moonEl];
}

const BASE_TONES: Record<ArchetypeName, ToneGuidelines> = {
  Cheerleader: { assertiveness: 0.85, warmth: 0.80, structure: 0.40, playfulness: 0.85 },
  Coach:       { assertiveness: 0.80, warmth: 0.60, structure: 0.70, playfulness: 0.40 },
  Spark:       { assertiveness: 0.70, warmth: 0.60, structure: 0.35, playfulness: 0.90 },
  Protector:   { assertiveness: 0.70, warmth: 0.75, structure: 0.50, playfulness: 0.35 },
  Driver:      { assertiveness: 0.75, warmth: 0.55, structure: 0.80, playfulness: 0.30 },
  Guardian:    { assertiveness: 0.55, warmth: 0.60, structure: 0.90, playfulness: 0.25 },
  Architect:   { assertiveness: 0.60, warmth: 0.50, structure: 0.85, playfulness: 0.35 },
  Guide:       { assertiveness: 0.50, warmth: 0.75, structure: 0.75, playfulness: 0.30 },
  Visionary:   { assertiveness: 0.65, warmth: 0.60, structure: 0.55, playfulness: 0.75 },
  Strategist:  { assertiveness: 0.60, warmth: 0.50, structure: 0.80, playfulness: 0.45 },
  Connector:   { assertiveness: 0.55, warmth: 0.65, structure: 0.50, playfulness: 0.80 },
  Mirror:      { assertiveness: 0.45, warmth: 0.70, structure: 0.60, playfulness: 0.55 },
  Healer:      { assertiveness: 0.50, warmth: 0.85, structure: 0.55, playfulness: 0.50 },
  Anchor:      { assertiveness: 0.50, warmth: 0.70, structure: 0.85, playfulness: 0.30 },
  Dreamer:     { assertiveness: 0.40, warmth: 0.75, structure: 0.50, playfulness: 0.70 },
  Nurturer:    { assertiveness: 0.30, warmth: 0.95, structure: 0.50, playfulness: 0.40 },
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function applyModifiers(base: ToneGuidelines, mars?: string, venus?: string): ToneGuidelines {
  const m = (mars || "").trim().toLowerCase();
  const v = (venus || "").trim().toLowerCase();

  // Mars (Action Style)
  const marsAssertive = m === "aries" || m === "scorpio" || m === "capricorn";
  const marsPassive   = m === "pisces" || m === "libra"  || m === "taurus";
  let assertiveness = base.assertiveness + (marsAssertive ? 0.15 : 0) - (marsPassive ? 0.15 : 0);

  // Venus (Relational Style)
  const venusSensitive = v === "cancer" || v === "pisces" || v === "libra";
  const venusCool      = v === "aquarius" || v === "virgo" || v === "capricorn";
  let warmth = base.warmth + (venusSensitive ? 0.15 : 0) - (venusCool ? 0.15 : 0);

  return {
    assertiveness: clamp01(assertiveness),
    warmth: clamp01(warmth),
    structure: clamp01(base.structure),
    playfulness: clamp01(base.playfulness),
  };
}

export function computeArchetypeProfile(input: {
  rising: string;
  moon: string;
  mars?: string;
  venus?: string;
}): ArchetypeProfile {
  const risingEl = elementFromSign(input.rising);
  const moonEl = elementFromSign(input.moon);
  const archetype = baseArchetype(risingEl, moonEl);
  const tone = applyModifiers(BASE_TONES[archetype], input.mars, input.venus);
  return {
    version: 1,
    archetype,
    tone_guidelines: tone,
    elements: { rising: risingEl, moon: moonEl },
    signs: { rising: input.rising, moon: input.moon, mars: input.mars, venus: input.venus },
    assignedAt: Date.now(),
  };
}
