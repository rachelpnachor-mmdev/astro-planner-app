// lib/utils/fsCompat.ts
// Works with default *and* namespace import shapes of expo-file-system

import FSDefault, * as FSNS from 'expo-file-system';

// Pick whichever shape actually has properties at runtime
const mod: any =
  (FSDefault && Object.keys(FSDefault || {}).length ? FSDefault : FSNS) || FSNS;

// Export a stable surface
export const documentDirectory: string | null = mod.documentDirectory ?? null;
export const cacheDirectory: string | null = mod.cacheDirectory ?? null;
export const hasFS: boolean = Boolean(documentDirectory || cacheDirectory);

// EncodingType may be missing on some versions — fall back to utf8 string
export const EncodingType =
  mod.EncodingType ?? ({ UTF8: 'utf8' } as { UTF8: 'utf8' });

// Functions
export const getInfoAsync = mod.getInfoAsync?.bind(mod);
export const makeDirectoryAsync = mod.makeDirectoryAsync?.bind(mod);
export const writeAsStringAsync = mod.writeAsStringAsync?.bind(mod);
export const readAsStringAsync = mod.readAsStringAsync?.bind(mod);
export const readDirectoryAsync = mod.readDirectoryAsync?.bind(mod);
export const deleteAsync = mod.deleteAsync?.bind(mod);

// Dev logs silenced: documentDirectory/cacheDirectory missing is expected on web; no warning needed.
