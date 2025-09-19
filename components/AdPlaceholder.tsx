import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HoroscopeColors } from '../constants/Colors';

export type AdPlaceholderProps = {
  type?: 'banner' | 'square' | 'native';
  testID?: string;
};

export default function AdPlaceholder({ type = 'banner', testID }: AdPlaceholderProps) {
  const adDimensions = {
    banner: { height: 90, width: '100%' },
    square: { height: 250, width: 250 },
    native: { height: 120, width: '100%' },
  };

  const dimensions = adDimensions[type];

  return (
    <View
      style={[
        styles.container,
        {
          height: dimensions.height,
          width: dimensions.width,
        },
      ]}
      testID={testID || 'AdPlaceholder'}
      accessibilityRole="banner"
      accessibilityLabel={`${type} advertisement placeholder`}
    >
      <Text style={styles.text}>
        {type === 'banner' ? 'Banner ad goes here' :
         type === 'square' ? 'Square ad goes here' :
         'Native ad goes here'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HoroscopeColors.surface,
    borderWidth: 1,
    borderColor: HoroscopeColors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    color: HoroscopeColors.text3,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});