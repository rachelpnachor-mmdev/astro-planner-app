// engine/localProvider.ts
import { computeBirthChart } from '../lib/astro/engine';
import type { BirthChart, ChartSettings } from '../lib/astro/types';
import type { Settings } from '../lib/types/settings';

export type BirthProfile = {
  birthDate?: string;      // 'YYYY-MM-DD'
  birthTime?: string;      // 'HH:mm'
  timezone?: string;       // IANA tz
  lat?: number;
  lon?: number;
};

export const localProvider = {
  async compute(profile: BirthProfile, settings: ChartSettings): Promise<BirthChart> {
    // Convert ChartSettings to Settings format expected by computeBirthChart
    const fullSettings: Settings = {
      features: {
        dailyCore: true,
        aiAssistant: true,
      },
      astrology: {
        system: 'western_tropical', // Default to western tropical for chart computation
        houseSystem: (settings.houseSystem as any) || 'placidus',
      },
      notifications: {
        dailyCoreReminder: false,
      },
      updatedAt: Date.now(),
    };

    const chart = await computeBirthChart(profile as any, fullSettings);
    chart.settings = {
      ...(chart.settings || {}),
      provider: chart.settings?.provider ?? 'local-engine@v1',
      methodology: settings.methodology ?? chart.settings?.methodology,
      zodiac: chart.settings?.zodiac ?? settings.zodiac,
      houseSystem: chart.settings?.houseSystem ?? settings.houseSystem,
    };
    chart.meta = { ...(chart.meta || {}), source: chart.meta?.source ?? 'local' };
    return chart as BirthChart;
  },
};
