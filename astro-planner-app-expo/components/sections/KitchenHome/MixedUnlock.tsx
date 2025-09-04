import React from 'react';
import { Text } from 'react-native';
export default function MixedUnlock({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Shopping list Today/This week (segmented control) (locked)' : 'Shopping list Today/This week (segmented control)'}</Text>;
}
