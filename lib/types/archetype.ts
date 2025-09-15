export type Element = "Fire" | "Earth" | "Air" | "Water";

export type ArchetypeName =
  | "Cheerleader" | "Coach" | "Spark" | "Protector"
  | "Driver" | "Guardian" | "Architect" | "Guide"
  | "Visionary" | "Strategist" | "Connector" | "Mirror"
  | "Healer" | "Anchor" | "Dreamer" | "Nurturer";

export interface ToneGuidelines {
  assertiveness: number; // 0..1
  warmth: number;        // 0..1
  structure: number;     // 0..1
  playfulness: number;   // 0..1
}

export interface ArchetypeProfile {
  version: 1;
  archetype: ArchetypeName;
  tone_guidelines: ToneGuidelines;
  elements: { rising: Element; moon: Element };
  signs: { rising: string; moon: string; mars?: string; venus?: string };
  assignedAt: number; // epoch ms
}
