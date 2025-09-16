// lib/astro/useBirthChart.ts
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { bus, EVENTS } from '../events/bus';
import { loadSettings } from '../profile/settings';
import { computeBirthChart } from './engine';
import type { BirthChart, BirthProfileInput } from './types';

// Assumes you already persist/load a birth profile somewhere:

import { loadBirthProfile } from '../profile/birth';

function toBirthProfileInput(profile: any): BirthProfileInput | null {
  if (!profile || !profile.dateISO || !profile.timezone || typeof profile.locationText !== 'string') return null;
  // For demo: stub tzOffsetMinutes, lat, lon
  // In real code, parse timezone and locationText
  return {
    dateISO: profile.dateISO + (profile.time24 ? 'T' + profile.time24 + ':00' : ''),
    tzOffsetMinutes: -360, // stub
    lat: 41.88, // stub
    lon: -87.63, // stub
  };
}

export function useBirthChart() {
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(true);

  const recompute = useCallback(async () => {
    setLoading(true);
    const [profileRaw, settings] = await Promise.all([loadBirthProfile(), loadSettings()]);
    const profile = toBirthProfileInput(profileRaw);
    if (!profile) {
      setChart(null);
      setLoading(false);
      return;
    }
    const next = await computeBirthChart(profile, settings);
    setChart(next);
    setLoading(false);
  }, []);

  useEffect(() => { recompute(); }, [recompute]);
  useFocusEffect(useCallback(() => { recompute(); }, [recompute]));

  useEffect(() => {
    const offSettings = bus.on(EVENTS.SETTINGS_CHANGED, () => {
      console.log('[LUNARIA][astro] settings changed → recompute');
      recompute();
    });
    const offBirth = bus.on(EVENTS.BIRTH_PROFILE_CHANGED, () => {
      console.log('[LUNARIA][astro] birth profile changed → recompute');
      recompute();
    });
    return () => { offSettings(); offBirth(); };
  }, [recompute]);

  return { chart, loading, recompute };
}
