import React from 'react';
import { Text } from 'react-native';
export default function TaskList({ locked = false }: { locked?: boolean }) {
  return (
    <Text accessibilityLabel={locked ? 'Task List locked' : 'Task List'}>
      {locked ? '🔒 Task List (locked)' : 'Task List'}
    </Text>
  );
}
