// __tests__/utils/types.test.ts
import type { BirthChart, ChartSettings, Degree, PointPosition } from '../../lib/astro/types';
import type { Settings } from '../../lib/types/settings';

describe('Type System Validation', () => {
  describe('BirthChart Type', () => {
    it('should accept valid BirthChart objects', () => {
      const validChart: BirthChart = {
        system: 'western_tropical',
        houses: {
          system: 'placidus',
          cusps: Array(12).fill(0).map((_, i) => ({
            signIndex: i % 12,
            degree: 15,
            lonDeg: i * 30 + 15,
            degInSign: 15,
            signIndexAries0: i,
          })),
        },
        points: [
          {
            point: 'Sun',
            ecliptic: {
              signIndex: 0,
              degree: 15,
              lonDeg: 15,
              degInSign: 15,
              signIndexAries0: 0,
            },
          },
        ],
        computedAt: Date.now(),
        settings: {
          methodology: 'western',
          zodiac: 'tropical',
          houseSystem: 'placidus',
          provider: 'local-engine@v1',
        },
      };

      // TypeScript compilation validates the type
      expect(validChart.system).toBe('western_tropical');
      expect(validChart.houses.cusps).toHaveLength(12);
      expect(validChart.points).toHaveLength(1);
    });

    it('should have correct degree structure', () => {
      const validDegree: Degree = {
        signIndex: 5, // Virgo
        degree: 23.5,
        lonDeg: 173.5, // 5 * 30 + 23.5
        degInSign: 23.5,
        signIndexAries0: 5,
      };

      expect(validDegree.signIndex).toBeGreaterThanOrEqual(0);
      expect(validDegree.signIndex).toBeLessThan(12);
      expect(validDegree.degree).toBeGreaterThanOrEqual(0);
      expect(validDegree.degree).toBeLessThan(30);
    });

    it('should have valid point positions', () => {
      const validPosition: PointPosition = {
        point: 'Mars',
        ecliptic: {
          signIndex: 3,
          degree: 12.8,
          lonDeg: 102.8,
          degInSign: 12.8,
          signIndexAries0: 3,
        },
      };

      expect(validPosition.point).toBe('Mars');
      expect(validPosition.ecliptic.signIndex).toBe(3);
    });
  });

  describe('ChartSettings Type', () => {
    it('should accept valid chart settings', () => {
      const validSettings: ChartSettings = {
        methodology: 'western',
        zodiac: 'tropical',
        houseSystem: 'placidus',
        ayanamsa: null,
      };

      expect(validSettings.methodology).toBe('western');
      expect(validSettings.zodiac).toBe('tropical');
    });

    it('should handle optional properties', () => {
      const minimalSettings: ChartSettings = {
        methodology: 'vedic',
      };

      expect(minimalSettings.methodology).toBe('vedic');
      expect(minimalSettings.zodiac).toBeUndefined();
    });
  });

  describe('Settings Type', () => {
    it('should accept valid app settings', () => {
      const validSettings: Settings = {
        features: {
          dailyCore: true,
          aiAssistant: false,
        },
        astrology: {
          system: 'western_tropical',
          houseSystem: 'placidus',
        },
        notifications: {
          dailyCoreReminder: true,
        },
        updatedAt: Date.now(),
      };

      expect(validSettings.features.dailyCore).toBe(true);
      expect(validSettings.astrology.system).toBe('western_tropical');
    });
  });

  describe('Type Compatibility', () => {
    it('should allow chart settings to work with provider settings', () => {
      const chartSettings: ChartSettings = {
        methodology: 'western',
        zodiac: 'tropical',
        houseSystem: 'whole_sign',
        ayanamsa: null,
      };

      // This should be able to be converted to Settings format
      const providerSettings: Settings = {
        features: {
          dailyCore: true,
          aiAssistant: true,
        },
        astrology: {
          system: 'western_tropical',
          houseSystem: chartSettings.houseSystem as any,
        },
        notifications: {
          dailyCoreReminder: false,
        },
        updatedAt: Date.now(),
      };

      expect(providerSettings.astrology.houseSystem).toBe('whole_sign');
    });

    it('should handle optional degree properties', () => {
      const baseDegree: Pick<Degree, 'signIndex' | 'degree'> = {
        signIndex: 7,
        degree: 8.2,
      };

      const extendedDegree: Degree = {
        ...baseDegree,
        lonDeg: 7 * 30 + 8.2,
        degInSign: 8.2,
        signIndexAries0: 7,
      };

      expect(extendedDegree.lonDeg).toBeCloseTo(218.2);
      expect(extendedDegree.degInSign).toBe(extendedDegree.degree);
    });
  });

  describe('Astrology System Types', () => {
    it('should validate astrology system values', () => {
      const validSystems = ['western_tropical', 'sidereal_lahiri', 'sidereal_fagan_bradley', 'sidereal_krishnamurti'];

      validSystems.forEach(system => {
        const settings: Settings = {
          features: { dailyCore: true, aiAssistant: true },
          astrology: { system: system as any, houseSystem: 'placidus' },
          notifications: { dailyCoreReminder: false },
          updatedAt: Date.now(),
        };

        expect(settings.astrology.system).toBe(system);
      });
    });

    it('should validate house system values', () => {
      const validHouseSystems = ['placidus', 'whole_sign', 'equal', 'koch'];

      validHouseSystems.forEach(houseSystem => {
        const settings: Settings = {
          features: { dailyCore: true, aiAssistant: true },
          astrology: { system: 'western_tropical', houseSystem: houseSystem as any },
          notifications: { dailyCoreReminder: false },
          updatedAt: Date.now(),
        };

        expect(settings.astrology.houseSystem).toBe(houseSystem);
      });
    });
  });
});