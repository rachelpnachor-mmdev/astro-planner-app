import React from 'react';
import { Text } from 'react-native';
export default function SelfCare({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Self-Care (locked)' : 'Self-Care Reflection'}</Text>;
}

