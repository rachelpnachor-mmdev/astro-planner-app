import React from 'react';
import { Text } from 'react-native';
export default function JournalPrompt({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Journal Prompt (locked)' : 'Journal Prompt'}</Text>;
}

