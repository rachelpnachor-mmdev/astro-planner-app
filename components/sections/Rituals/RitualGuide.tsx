import React from 'react';
import { Text } from 'react-native';
export default function RitualGuide({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Ritual Guide (locked)' : 'Ritual Guide (step-by-step)'}</Text>;
}
