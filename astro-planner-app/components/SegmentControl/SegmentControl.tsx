import React from 'react';
import { Text, View } from 'react-native';

export type SegmentOption = {
  key: string;
  label: string;
};

export type SegmentControlProps = {
  options: SegmentOption[];
};

export const SegmentControl: React.FC<SegmentControlProps> = ({ options }) => {
  if (!options || options.length < 2) {
    console.warn('SegmentControl: options must have at least 2 items');
    return null;
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map(option => (
        <View key={option.key} style={{ margin: 4, padding: 8, borderWidth: 1, borderRadius: 8 }}>
          <Text>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};
