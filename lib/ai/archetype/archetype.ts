import * as FileSystem from 'expo-file-system';
import { ARCHETYPE_JSON, PROFILE_DIR } from '../memory/paths';

// Elements by sign
const ELEMENT: Record<string, 'Fire'|'Earth'|'Air'|'Water'> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

type ArchetypeName =
  | 'Cheerleader' | 'Coach' | 'Spark' | 'Protector'
  | 'Driver' | 'Guardian' | 'Architect' | 'Guide'
  | 'Visionary' | 'Strategist' | 'Connector' | 'Mirror'
  | 'Healer' | 'Anchor' | 'Dreamer' | 'Nurturer';

type ToneGuidelines = {
  assertiveness: number; // 0..1
  warmth: number;       // 0..1
  structure: number;    // 0..1
  playfulness: number;  // 0..1
};

export type ArchetypeProfile = {
  archetype: ArchetypeName;
  tone_guidelines: ToneGuidelines;
  basis: { rising: string; moon: string; mars: string; venus: string };
};

function baseArchetype(rising: string, moon: string): ArchetypeName {
  const r = ELEMENT[rising];
  const m = ELEMENT[moon];
  const map: Record<string, ArchetypeName> = {
    'Fire:Fire': 'Cheerleader',
    'Fire:Earth': 'Coach',
    'Fire:Air'  : 'Spark',
    'Fire:Water': 'Protector',
    'Earth:Fire': 'Driver',
    'Earth:Earth':'Guardian',
    'Earth:Air' : 'Architect',
    'Earth:Water':'Guide',
    'Air:Fire'  : 'Visionary',
    'Air:Earth' : 'Strategist',
    'Air:Air'   : 'Connector',
    'Air:Water' : 'Mirror',
    'Water:Fire': 'Healer',
    'Water:Earth':'Anchor',
    'Water:Air' : 'Dreamer',
    'Water:Water':'Nurturer',
  };
  return map[`${r}:${m}`];
}

function defaultToneFor(archetype: ArchetypeName): ToneGuidelines {
  const table: Partial<Record<ArchetypeName, ToneGuidelines>> = {
    Nurturer:  { assertiveness: 0.3, warmth: 0.95, structure: 0.5, playfulness: 0.4 },
    Guardian:  { assertiveness: 0.5, warmth: 0.5,  structure: 0.9, playfulness: 0.2 },
    Architect: { assertiveness: 0.6, warmth: 0.4,  structure: 0.9, playfulness: 0.3 },
    Coach:     { assertiveness: 0.8, warmth: 0.6,  structure: 0.7, playfulness: 0.5 },
    Cheerleader:{assertiveness: 0.8, warmth: 0.8,  structure: 0.4, playfulness: 0.8 },
    Protector: { assertiveness: 0.7, warmth: 0.7,  structure: 0.6, playfulness: 0.3 },
    Driver:    { assertiveness: 0.7, warmth: 0.4,  structure: 0.8, playfulness: 0.2 },
    Guide:     { assertiveness: 0.4, warmth: 0.7,  structure: 0.7, playfulness: 0.3 },
    Visionary: { assertiveness: 0.6, warmth: 0.6,  structure: 0.5, playfulness: 0.7 },
    Strategist:{ assertiveness: 0.6, warmth: 0.4,  structure: 0.8, playfulness: 0.4 },
    Connector: { assertiveness: 0.5, warmth: 0.6,  structure: 0.5, playfulness: 0.7 },
    Mirror:    { assertiveness: 0.4, warmth: 0.7,  structure: 0.5, playfulness: 0.5 },
    Healer:    { assertiveness: 0.5, warmth: 0.8,  structure: 0.5, playfulness: 0.4 },
    Anchor:    { assertiveness: 0.5, warmth: 0.6,  structure: 0.8, playfulness: 0.3 },
    Dreamer:   { assertiveness: 0.3, warmth: 0.7,  structure: 0.4, playfulness: 0.7 },
    Spark:     { assertiveness: 0.7, warmth: 0.7,  structure: 0.5, playfulness: 0.8 },
  };
  return table[archetype]!;
}

function applyModifiers(tone: ToneGuidelines, mars: string, venus: string): ToneGuidelines {
  const assertiveMars = ['Aries','Scorpio','Capricorn'];
  const passiveMars = ['Pisces','Libra','Taurus'];
  const sensitiveVenus = ['Cancer','Pisces','Libra'];
  const coolVenus = ['Aquarius','Virgo','Capricorn'];

  let t = { ...tone };
  if (assertiveMars.includes(mars)) t.assertiveness = Math.min(1, t.assertiveness + 0.15);
  if (passiveMars.includes(mars))  t.assertiveness = Math.max(0, t.assertiveness - 0.1);
  if (sensitiveVenus.includes(venus)) t.warmth = Math.min(1, t.warmth + 0.1);
  if (coolVenus.includes(venus))      t.warmth = Math.max(0, t.warmth - 0.1);
  return t;
}

export async function saveArchetypeProfile(params: {
  rising: string; moon: string; mars: string; venus: string;
}) {
  // ensure dir exists
  const dir = PROFILE_DIR;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const arche = baseArchetype(params.rising, params.moon);
  const tone = applyModifiers(defaultToneFor(arche), params.mars, params.venus);

  const profile = {
    archetype: arche,
    tone_guidelines: tone,
    basis: params,
  };

  await FileSystem.writeAsStringAsync(ARCHETYPE_JSON, JSON.stringify(profile, null, 2));
  return profile;
}

export async function loadArchetypeProfile() {
  try {
    const info = await FileSystem.getInfoAsync(ARCHETYPE_JSON);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(ARCHETYPE_JSON);
    return JSON.parse(raw) as any;
  } catch { return null; }
}
