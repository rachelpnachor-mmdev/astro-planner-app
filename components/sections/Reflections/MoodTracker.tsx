import React from 'react';
import { Text } from 'react-native';
export default function MoodTracker({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Mood Tracker (locked)' : 'Mood Tracker'}</Text>;
}

