import React from 'react';
import { Text } from 'react-native';
export default function WeeklyInventory({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Weekly Inventory (locked)' : 'Weekly Inventory (Checklist of supplies for the week)'}</Text>;
}
