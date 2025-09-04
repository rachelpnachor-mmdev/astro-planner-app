import React from 'react';
import { Text } from 'react-native';
export default function DailyGoalTasks({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Daily Goal Tasks (locked)' : 'Daily Goal Tasks'}</Text>;
}
