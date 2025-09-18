// __tests__/lib/astro/engine.test.ts
import { computeBirthChart } from '../../../lib/astro/engine';
import type { BirthProfileInput } from '../../../lib/astro/types';
import type { Settings } from '../../../lib/types/settings';

describe('Astrological Engine', () => {
  const mockProfile: BirthProfileInput = {
    dateISO: '1990-12-25T12:00:00-05:00',
    tzOffsetMinutes: -300, // EST
    lat: 40.7128,
    lon: -74.0060,
  };

  const mockSettings: Settings = {
    features: {
      dailyCore: true,
      aiAssistant: true,
    },
    astrology: {
      system: 'western_tropical',
      houseSystem: 'placidus',
    },
    notifications: {
      dailyCoreReminder: false,
    },
    updatedAt: Date.now(),
  };

  describe('computeBirthChart', () => {
    it('should generate a valid birth chart', async () => {
      const chart = await computeBirthChart(mockProfile, mockSettings);

      expect(chart).toBeDefined();
      expect(chart.system).toBe('western_tropical');
      expect(chart.houses).toBeDefined();
      expect(chart.houses.system).toBe('placidus');
      expect(chart.houses.cusps).toHaveLength(12);
      expect(chart.points).toBeDefined();
      expect(chart.points.length).toBeGreaterThan(0);
      expect(chart.computedAt).toBeDefined();
    });

    it('should generate consistent results for the same input', async () => {
      const chart1 = await computeBirthChart(mockProfile, mockSettings);
      const chart2 = await computeBirthChart(mockProfile, mockSettings);

      expect(chart1.points).toEqual(chart2.points);
      expect(chart1.houses.cusps).toEqual(chart2.houses.cusps);
    });

    it('should include all major planets', async () => {
      const chart = await computeBirthChart(mockProfile, mockSettings);

      const expectedPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      const planetNames = chart.points.map(point => point.point);

      expectedPlanets.forEach(planet => {
        expect(planetNames).toContain(planet);
      });
    });

    it('should have valid degree values', async () => {
      const chart = await computeBirthChart(mockProfile, mockSettings);

      chart.points.forEach(point => {
        expect(point.ecliptic.signIndex).toBeGreaterThanOrEqual(0);
        expect(point.ecliptic.signIndex).toBeLessThan(12);
        expect(point.ecliptic.degree).toBeGreaterThanOrEqual(0);
        expect(point.ecliptic.degree).toBeLessThan(30);
      });

      chart.houses.cusps.forEach(cusp => {
        expect(cusp.signIndex).toBeGreaterThanOrEqual(0);
        expect(cusp.signIndex).toBeLessThan(12);
        expect(cusp.degree).toBeGreaterThanOrEqual(0);
        expect(cusp.degree).toBeLessThan(30);
      });
    });

    it('should generate different charts for different birth times', async () => {
      const profile1 = { ...mockProfile, dateISO: '1990-12-25T06:00:00-05:00' };
      const profile2 = { ...mockProfile, dateISO: '1990-12-25T18:00:00-05:00' };

      const chart1 = await computeBirthChart(profile1, mockSettings);
      const chart2 = await computeBirthChart(profile2, mockSettings);

      // Charts should be different (different house cusps at minimum)
      expect(chart1.houses.cusps).not.toEqual(chart2.houses.cusps);
    });

    it('should handle edge cases gracefully', async () => {
      const edgeCaseProfile = {
        ...mockProfile,
        dateISO: '', // Empty date
        lat: 0,
        lon: 0,
      };

      const chart = await computeBirthChart(edgeCaseProfile, mockSettings);
      expect(chart).toBeDefined();
      expect(chart.points).toHaveLength(10); // Should still have all planets
    });
  });
});