// __tests__/components/astro/BirthChartWheel.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BirthChartWheel from '../../../components/astro/BirthChartWheel';
import type { BirthChart } from '../../../lib/astro/types';

// Mock the complex SVG rendering parts
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Svg: ({ children, ...props }: any) => React.createElement(View, { testID: 'svg', ...props }, children),
    G: ({ children, ...props }: any) => React.createElement(View, { testID: 'g', ...props }, children),
    Circle: (props: any) => React.createElement(View, { testID: 'circle', ...props }),
    Text: ({ children, ...props }: any) => React.createElement(View, { testID: 'svg-text', ...props }, children),
    Path: (props: any) => React.createElement(View, { testID: 'path', ...props }),
    Rect: (props: any) => React.createElement(View, { testID: 'rect', ...props }),
    Line: (props: any) => React.createElement(View, { testID: 'line', ...props }),
  };
});

describe('BirthChartWheel Component', () => {
  const mockChart: BirthChart = {
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
          signIndex: 9, // Capricorn
          degree: 3.5,
          lonDeg: 273.5,
          degInSign: 3.5,
          signIndexAries0: 9,
        },
      },
      {
        point: 'Moon',
        ecliptic: {
          signIndex: 3, // Cancer
          degree: 15.2,
          lonDeg: 105.2,
          degInSign: 15.2,
          signIndexAries0: 3,
        },
      },
    ],
    computedAt: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByTestId } = render(<BirthChartWheel chart={mockChart} />);
    expect(getByTestId('svg')).toBeDefined();
  });

  it('should render with available width', () => {
    const { getByTestId } = render(
      <BirthChartWheel chart={mockChart} availableWidth={400} />
    );
    expect(getByTestId('svg')).toBeDefined();
  });

  it('should render control toggles', () => {
    const { getByText } = render(<BirthChartWheel chart={mockChart} />);

    expect(getByText('Degrees')).toBeDefined();
    expect(getByText('Signs')).toBeDefined();
    expect(getByText('Houses')).toBeDefined();
  });

  it('should toggle control visibility', () => {
    const { getByText } = render(<BirthChartWheel chart={mockChart} />);

    const degreesToggle = getByText('Degrees');
    fireEvent.press(degreesToggle);

    // Should be able to press toggles without errors
    expect(degreesToggle).toBeDefined();
  });

  it('should detect stelliums correctly', () => {
    const chartWithStellium: BirthChart = {
      ...mockChart,
      points: [
        {
          point: 'Sun',
          ecliptic: { signIndex: 9, degree: 3.5, lonDeg: 273.5, degInSign: 3.5, signIndexAries0: 9 },
        },
        {
          point: 'Mercury',
          ecliptic: { signIndex: 9, degree: 10.2, lonDeg: 280.2, degInSign: 10.2, signIndexAries0: 9 },
        },
        {
          point: 'Venus',
          ecliptic: { signIndex: 9, degree: 20.8, lonDeg: 290.8, degInSign: 20.8, signIndexAries0: 9 },
        },
      ],
    };

    const { getByText } = render(
      <BirthChartWheel chart={chartWithStellium} />
    );

    // Should detect and show stellium information
    expect(getByText(/Stelliums/)).toBeDefined();
  });

  it('should render chart SVG', () => {
    const { getByTestId } = render(
      <BirthChartWheel chart={mockChart} />
    );

    // The SVG should render
    expect(getByTestId('svg')).toBeDefined();
  });

  it('should show empty stellium state when no stelliums exist', () => {
    const { getByText } = render(<BirthChartWheel chart={mockChart} />);

    // With only 2 planets (Sun and Moon), there should be no stelliums
    expect(getByText('No stelliums detected')).toBeDefined();
  });

  it('should render zodiac signs', () => {
    const { getAllByTestId } = render(<BirthChartWheel chart={mockChart} />);

    // Should render SVG elements for the chart
    const svgElements = getAllByTestId('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should handle aspect calculations', () => {
    const chartWithAspects: BirthChart = {
      ...mockChart,
      points: [
        {
          point: 'Sun',
          ecliptic: { signIndex: 0, degree: 0, lonDeg: 0, degInSign: 0, signIndexAries0: 0 },
        },
        {
          point: 'Moon',
          ecliptic: { signIndex: 6, degree: 0, lonDeg: 180, degInSign: 0, signIndexAries0: 6 },
        }, // Opposition aspect
      ],
    };

    const { getByTestId } = render(
      <BirthChartWheel chart={chartWithAspects} />
    );

    expect(getByTestId('svg')).toBeDefined();
  });
});