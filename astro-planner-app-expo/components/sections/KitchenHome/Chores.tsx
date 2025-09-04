import React from 'react';
import { Text } from 'react-native';
export default function Chores({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Chores (locked)' : 'Chores (Indoor Large, Indoor Small, Outdoor, Laundry, Plants, Projects)'}</Text>;
}
