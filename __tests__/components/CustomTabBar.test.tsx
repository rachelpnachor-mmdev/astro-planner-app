import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import CustomTabBar from '../../components/CustomTabBar';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Mock navigation props
const createMockProps = (focusedIndex = 0): BottomTabBarProps => ({
  state: {
    routes: [
      { key: 'Horoscope-1', name: 'Horoscope', params: undefined },
      { key: 'Rituals-2', name: 'Rituals', params: undefined },
      { key: 'Apothecary-3', name: 'Apothecary', params: undefined },
      { key: 'Goals-4', name: 'Goals', params: undefined },
      { key: 'BOS-5', name: 'BOS', params: undefined },
    ],
    index: focusedIndex,
    routeNames: ['Horoscope', 'Rituals', 'Apothecary', 'Goals', 'BOS'],
    history: [],
    key: 'tab-test',
    type: 'tab',
    stale: false,
  },
  descriptors: {},
  navigation: {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    canGoBack: jest.fn(),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
});

const renderWithNavigation = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('CustomTabBar', () => {
  it('renders all tab items', () => {
    const props = createMockProps();
    const { getByLabelText } = renderWithNavigation(<CustomTabBar {...props} />);

    expect(getByLabelText('🌙 Horoscope tab, selected')).toBeTruthy();
    expect(getByLabelText('🔮 Rituals tab')).toBeTruthy();
    expect(getByLabelText('🧿 Apothecary tab')).toBeTruthy();
    expect(getByLabelText('⭐ Goals tab')).toBeTruthy();
    expect(getByLabelText('📖 BOS tab')).toBeTruthy();
  });

  it('shows label only for focused tab', () => {
    const props = createMockProps(0); // Horoscope focused
    const { getByText, queryByText } = renderWithNavigation(<CustomTabBar {...props} />);

    // Focused tab should show label
    expect(getByText('Horoscope')).toBeTruthy();

    // Other tabs should not show labels
    expect(queryByText('Rituals')).toBeNull();
    expect(queryByText('Apothecary')).toBeNull();
    expect(queryByText('Goals')).toBeNull();
    expect(queryByText('BOS')).toBeNull();
  });

  it('calls navigation.navigate when tab is pressed', () => {
    const props = createMockProps();
    const { getByLabelText } = renderWithNavigation(<CustomTabBar {...props} />);

    fireEvent.press(getByLabelText('🔮 Rituals tab'));
    expect(props.navigation.navigate).toHaveBeenCalledWith('Rituals');
  });

  it('does not navigate when already focused tab is pressed', () => {
    const props = createMockProps(0); // Horoscope focused
    const { getByLabelText } = renderWithNavigation(<CustomTabBar {...props} />);

    fireEvent.press(getByLabelText('🌙 Horoscope tab, selected'));
    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });

  it('applies correct styling to focused tab', () => {
    const props = createMockProps(1); // Rituals focused
    const { getByLabelText } = renderWithNavigation(<CustomTabBar {...props} />);

    const focusedTab = getByLabelText('🔮 Rituals tab, selected');
    expect(focusedTab).toBeTruthy();

    // Check that the label appears for focused tab
    const { getByText } = renderWithNavigation(<CustomTabBar {...props} />);
    expect(getByText('Rituals')).toBeTruthy();
  });
});