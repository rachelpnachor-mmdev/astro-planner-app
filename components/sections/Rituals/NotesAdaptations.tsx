import React from 'react';
import { Text } from 'react-native';
export default function NotesAdaptations({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Notes/Adaptations (locked)' : 'Notes/Adaptations'}</Text>;
}
