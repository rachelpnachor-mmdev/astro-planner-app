import type { BirthChart, ChartSettings } from '../lib/astro/types';
import type { BirthProfile } from '../lib/types/profile';

export interface ChartProvider {
  // Minimal, provider-agnostic: return a canonical BirthChart
  compute(profile: BirthProfile, settings: ChartSettings): Promise<BirthChart>;
}

export type ProviderKey = 'western' | 'vedic' | 'sidereal' | 'hellenistic';

export function keyFromSettings(settings: ChartSettings): ProviderKey {
  return (settings.methodology as ProviderKey) ?? 'western';
}
