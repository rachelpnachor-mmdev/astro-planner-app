import React from 'react';
import { Text } from 'react-native';
export default function TodayToggle({ locked = false }: { locked?: boolean }) {
  return (
    <Text
      accessibilityLabel={locked ? 'Today/Week/Month toggle locked' : 'Today/Week/Month toggle segmented control'}
    >
      {locked ? '🔒 Today/Week/Month (locked)' : 'Today/Week/Month toggle (segmented control)'}
    </Text>
  );
}
