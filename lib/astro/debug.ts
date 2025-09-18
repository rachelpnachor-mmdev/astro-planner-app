// lib/astro/debug.ts
/* Dev-only helpers. Safe to import anywhere; no-ops in production builds. */

export type DebugPointRow = {
  id: string;
  lon?: number;
  degInSign?: number;
  givenSignIndex?: number;
  derivedSignIndex?: number;
  derivedSignName?: string;
  givenDeg?: number;
  reason?: string;
};

export const __DEV_ON__ = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

export function devLog(title: string, payload: unknown) {
  if (!__DEV_ON__) return;
  // Use console.log to preserve order in Metro
   
  console.log(title, payload);
}

export function devTable(title: string, rows: Record<string, unknown>[] | unknown[]) {
  if (!__DEV_ON__) return;
   
  console.log(title);
   
  console.table(rows as any);
}
