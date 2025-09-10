import React from 'react';
import { Text } from 'react-native';
export default function CreativeFlow({ locked = false }: { locked?: boolean }) {
  return (
    <Text accessibilityLabel={locked ? 'Creative Flow locked' : 'Creative Flow (locked unless Goals Package)'}>
      {locked ? '🔒 Creative Flow (locked)' : 'Creative Flow (locked unless Goals Package)'}
    </Text>
  );
}
