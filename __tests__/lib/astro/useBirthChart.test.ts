// __tests__/lib/astro/useBirthChart.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useBirthChart } from '../../../lib/astro/useBirthChart';
import type { BirthProfile } from '../../../lib/astro/useBirthChart';
import type { ChartSettings } from '../../../lib/astro/types';

// Mock the provider registry
jest.mock('../../../engine/registry', () => ({
  registry: {
    western: {
      compute: jest.fn().mockResolvedValue({
        system: 'western_tropical',
        houses: { system: 'placidus', cusps: [] },
        points: [],
        computedAt: Date.now(),
      }),
    },
  },
}));

describe('useBirthChart Hook', () => {
  const mockProfile: BirthProfile = {
    birthDate: '1990-12-25',
    birthTime: '12:00',
    timezone: 'America/New_York',
    lat: 40.7128,
    lon: -74.0060,
  };

  const mockSettings: ChartSettings = {
    methodology: 'western',
    zodiac: 'tropical',
    houseSystem: 'placidus',
    ayanamsa: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useBirthChart(null, mockSettings));

    expect(result.current.chart).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should handle null profile gracefully', () => {
    const { result } = renderHook(() => useBirthChart(null, mockSettings));

    expect(result.current.chart).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle incomplete profile gracefully', () => {
    const incompleteProfile: BirthProfile = {
      birthDate: undefined,
    };

    const { result } = renderHook(() => useBirthChart(incompleteProfile, mockSettings));

    expect(result.current.chart).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should compute chart when valid profile is provided', async () => {
    const { result } = renderHook(() => useBirthChart(mockProfile, mockSettings));

    // Should start loading
    expect(result.current.loading).toBe(true);

    // Wait for computation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.chart).not.toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should provide refresh functionality', () => {
    const { result } = renderHook(() => useBirthChart(mockProfile, mockSettings));

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should handle profile updates', async () => {
    const { result, rerender } = renderHook(
      ({ profile, settings }) => useBirthChart(profile, settings),
      {
        initialProps: { profile: mockProfile, settings: mockSettings },
      }
    );

    // Wait for initial computation
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialChart = result.current.chart;

    // Update profile
    const updatedProfile = {
      ...mockProfile,
      birthTime: '18:00', // Different time
    };

    rerender({ profile: updatedProfile, settings: mockSettings });

    // Should trigger recomputation
    await waitFor(() => {
      expect(result.current.chart).not.toBe(initialChart);
    });
  });
});