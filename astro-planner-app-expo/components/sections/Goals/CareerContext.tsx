import React from 'react';
import { Text } from 'react-native';
export default function CareerContext({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Career Context (locked)' : 'Career Context'}</Text>;
}
