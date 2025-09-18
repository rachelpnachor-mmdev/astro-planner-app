// lib/astro/useBirthChart.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { keyFromSettings } from '../../engine/provider';
import { registry } from '../../engine/registry';
import type { BirthChart, ChartSettings } from './types';

// If you already have BirthProfile elsewhere, import it and remove this.
export type BirthProfile = {
  birthDate?: string;       // 'YYYY-MM-DD'
  birthTime?: string;       // 'HH:mm'
  timezone?: string;        // IANA tz
  lat?: number;
  lon?: number;
};

export type UseBirthChartResult = {
  chart: BirthChart | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

export async function computeBirthChartViaProviders(
  profile: BirthProfile,
  settings: ChartSettings
): Promise<BirthChart> {
  const providerKey = keyFromSettings(settings);
  const provider = registry[providerKey];

  try {
    const computed = await provider.compute(profile as any, settings);
    return computed as BirthChart;
  } catch (err) {
    console.warn('[useBirthChart] provider failed; falling back to local western:', err);
    const fallback = await registry.western.compute(
      profile as any,
      { ...settings, methodology: 'western' } as ChartSettings
    );
    return fallback as BirthChart;
  }
}

export function useBirthChart(
  profile: BirthProfile | null | undefined,
  settings: ChartSettings | null | undefined
): UseBirthChartResult {
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const depsKey = useMemo(() => {
    const p = profile ?? {};
    const s = settings ?? {};
    return JSON.stringify({
      date: (p as any).birthDate,
      time: (p as any).birthTime,
      tz: (p as any).timezone,
      // Exclude lat/lon from dependency since they get resolved during computation
      // This prevents infinite loop when coordinates are resolved from locationText
      locationText: (p as any).locationText,
      methodology: (s as any).methodology,
      zodiac: (s as any).zodiac,
      houseSystem: (s as any).houseSystem,
      ayanamsa: (s as any).ayanamsa,
    });
  }, [profile, settings]);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const compute = useCallback(async () => {
    if (!profile || !settings) {
      setLoading(false);
      setChart(null);
      setError(null);
      return;
    }

    // Additional validation - ensure we have essential birth data
    const birthDate = (profile as any)?.birthDate;
    if (!birthDate || birthDate.trim() === '' || birthDate === '—') {
      setLoading(false);
      setChart(null);
      setError(new Error('Birth date is required'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const computed = await computeBirthChartViaProviders(profile, settings);

      // DEV sanity log (type-safe)
      if (__DEV__) {
        const sun = computed?.points?.find((p: any) =>
          p?.point === 'Sun' ||
          p?.body === 'Sun' ||
          p?.point?.name === 'Sun' ||
          p?.body?.name === 'Sun'
        );
        const provider =
          (computed as any)?.settings?.provider ??
          (computed as any)?.settings?.methodology ??
          'unknown';

        const e: any = sun?.ecliptic ?? {};
        const lonDeg =
          typeof e.lonDeg === 'number' ? e.lonDeg :
          typeof e?.longitude?.deg === 'number' ? e.longitude.deg :
          typeof e?.lon?.deg === 'number' ? e.lon.deg :
          (Number.isFinite(Number(e?.longitude)) ? Number(e.longitude) : undefined);

         
        console.log('[useBirthChart] provider=', provider, 'Sun.lonDeg=', lonDeg);
      }

      if (mountedRef.current) setChart(computed);
    } catch (e: any) {
      if (mountedRef.current) setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [depsKey]);

  useEffect(() => {
    void compute();
  }, [compute]);

  const refresh = useCallback(async () => {
    await compute();
  }, [compute]);

  return { chart, loading, error, refresh };
}

export default useBirthChart;
