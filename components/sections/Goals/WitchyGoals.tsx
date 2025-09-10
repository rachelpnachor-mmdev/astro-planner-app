import React from 'react';
import { Text } from 'react-native';
export default function WitchyGoals({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Witchy Goals (locked)' : 'Witchy Goals (themes like Protection, Healing, Abundance)'}</Text>;
}
