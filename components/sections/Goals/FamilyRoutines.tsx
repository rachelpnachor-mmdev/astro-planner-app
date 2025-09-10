import React from 'react';
import { Text } from 'react-native';
export default function FamilyRoutines({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Family Routines (locked)' : 'Family Routines (e.g., game night, movie night)'}</Text>;
}
