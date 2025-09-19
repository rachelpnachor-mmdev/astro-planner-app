import React from 'react';
import { render } from '@testing-library/react-native';
import AdPlaceholder from '../../components/AdPlaceholder';

describe('AdPlaceholder', () => {
  it('renders banner ad placeholder by default', () => {
    const { getByText, getByTestId } = render(<AdPlaceholder />);

    expect(getByText('Banner ad goes here')).toBeTruthy();
    expect(getByTestId('AdPlaceholder')).toBeTruthy();
  });

  it('renders square ad placeholder when type is square', () => {
    const { getByText } = render(<AdPlaceholder type="square" />);

    expect(getByText('Square ad goes here')).toBeTruthy();
  });

  it('renders native ad placeholder when type is native', () => {
    const { getByText } = render(<AdPlaceholder type="native" />);

    expect(getByText('Native ad goes here')).toBeTruthy();
  });

  it('uses custom testID when provided', () => {
    const { getByTestId } = render(<AdPlaceholder testID="custom-ad" />);

    expect(getByTestId('custom-ad')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const { getByTestId } = render(<AdPlaceholder type="banner" />);
    const placeholder = getByTestId('AdPlaceholder');

    expect(placeholder.props.accessibilityRole).toBe('banner');
    expect(placeholder.props.accessibilityLabel).toBe('banner advertisement placeholder');
  });
});