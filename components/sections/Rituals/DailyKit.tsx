import React from 'react';
import { Text } from 'react-native';
export default function DailyKit({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Daily Kit (locked)' : 'Daily Kit (checklist)'}</Text>;
}
