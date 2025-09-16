// lib/astro/useBirthChart.ts
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { bus, EVENTS } from '../events/bus';
import { loadSettings } from '../profile/settings';
import { computeBirthChart } from './engine';
import type { BirthChart } from './types';

// Assumes you already persist/load a birth profile somewhere:

import { loadBirthProfile } from '../profile/birth';

// Tolerant view of what's persisted for a birth profile.
type BirthProfileSaved = {
  dateISO?: string;
  birthDate?: string; date?: string;
  birthTime?: string; time?: string;
  timezone?: string; timeZone?: string; tz?: string;
  lat?: number; latitude?: number;
  lon?: number; longitude?: number;
};

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' ? v : undefined);


export function useBirthChart() {
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(true);

  const recompute = useCallback(async () => {
    setLoading(true);
  const [rawProfile, settings] = await Promise.all([loadBirthProfile(), loadSettings()]); // rawProfile: any

    // Tolerant mapping of saved fields
    // Tolerant mapping of saved fields (typed, no `any`)
    const p = (rawProfile ?? {}) as BirthProfileSaved;
    const birthDate = str(p.birthDate ?? p.date);                  // 'YYYY-MM-DD'
    const birthTimeRaw = str(p.birthTime ?? p.time);               // maybe ''
    const birthTime = /^\d{2}:\d{2}$/.test(birthTimeRaw) ? birthTimeRaw : '00:00';
    const zoneId = str(p.timezone ?? p.timeZone ?? p.tz);
    const lat = num(p.lat ?? p.latitude);
    const lon = num(p.lon ?? p.longitude);

    // Prefer a prebuilt ISO if present, otherwise build a basic local ISO.
    // (No external libs here; this at least uses your saved date & time.)
  let dateISO: string | null = str(p.dateISO) || null;
    if (!dateISO && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      // “Local” ISO string; device zone will be applied by JS Date.
      // Good enough for now; we can switch to Luxon later for DST-aware offsets.
      const time = /^\d{2}:\d{2}$/.test(birthTime) ? birthTime : '00:00';
      dateISO = `${birthDate}T${time}:00`;
    }

    // Dev log so we can verify what we compute with
     
    console.log('[LUNARIA][astro] compute input (basic)', {
      dateISO, zoneId, lat, lon,
      system: settings?.astrology?.system,
      houseSystem: settings?.astrology?.houseSystem,
    });

    if (!dateISO) {
      setChart(null);
      setLoading(false);
      return;
    }

    try {
      // Default coords if missing so types stay numeric
      const next = await computeBirthChart(
        { dateISO, lat: lat ?? 0, lon: lon ?? 0, tzOffsetMinutes: 0 },
        settings
      );
      setChart(next);
    } catch (err) {
       
      console.log('[LUNARIA][astro] compute error', String(err));
      setChart(null);
    }
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
