import React from 'react';
import { Text } from 'react-native';
export default function Gratitude({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Gratitude (locked)' : 'Gratitude'}</Text>;
}

