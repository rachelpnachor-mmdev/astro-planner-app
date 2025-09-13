import { mockProvider } from './mock';
import { remoteProvider } from './remote';
import type { LlmProvider } from './types';
const MODE = (process.env.EXPO_PUBLIC_AI_PROVIDER ?? 'mock').toLowerCase();
export const provider: LlmProvider = MODE === 'remote' ? remoteProvider : mockProvider;
