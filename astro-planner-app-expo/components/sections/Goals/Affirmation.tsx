import React from 'react';
import { Text } from 'react-native';
export default function Affirmation({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Affirmation (locked)' : 'Affirmation of the Day'}</Text>;
}
