import React from 'react';
import { Text } from 'react-native';
export default function UpcomingEvents({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Upcoming Events (locked)' : 'Upcoming Events'}</Text>;
}
