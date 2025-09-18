// engine/registry.ts
import { apiProvider } from './apiProvider';
import { localProvider } from './localProvider';

export type ProviderKey = 'western' | 'vedic' | 'sidereal' | 'hellenistic';

export const registry: Record<ProviderKey, { compute: any }> = {
  western: apiProvider,     // MVP: API
  vedic: localProvider,     // fallback (or lock in UI)
  sidereal: localProvider,
  hellenistic: localProvider,
};
