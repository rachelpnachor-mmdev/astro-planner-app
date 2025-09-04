import React from 'react';
import { Text } from 'react-native';
export default function FocusOfDay({ locked = false }: { locked?: boolean }) {
  return <Text>{locked ? '🔒 Focus of the Day (locked)' : 'Focus of the Day (Do/Don’t/Opportunities/Warnings)'}</Text>;
    return (
      <Text
        accessibilityLabel={locked ? 'Focus of the Day locked' : 'Focus of the Day: Do, Don’t, Opportunities, Warnings'}
      >
        {locked ? '🔒 Focus of the Day (locked)' : 'Focus of the Day (Do/Don’t/Opportunities/Warnings)'}
      </Text>
    );
}
