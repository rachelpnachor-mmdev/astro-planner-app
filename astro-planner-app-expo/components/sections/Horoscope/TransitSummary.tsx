import React from 'react';
import { Text } from 'react-native';
export default function TransitSummary({ locked = false }: { locked?: boolean }) {
  return (
    <Text accessibilityLabel={locked ? 'Transit Summary locked' : 'Transit Summary'}>
      {locked ? '🔒 Transit Summary (locked)' : 'Transit Summary'}
    </Text>
  );
}
