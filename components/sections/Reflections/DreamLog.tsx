import React from 'react';
import { Text } from 'react-native';
export default function DreamLog({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Dream Log (locked)' : 'Dream Log'}</Text>;
}

