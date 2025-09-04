import React from 'react';
import { Text } from 'react-native';
export default function Meals({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Meals (locked)' : 'Meals (Lunch, Dinner, Snacks/Tea, Shopping List)'}</Text>;
}
