import { Text, View } from 'react-native';
import { SegmentControl } from '../../SegmentControl';

export default function TodayToggle({ locked = false }: { locked?: boolean }) {
  if (locked) {
    return (
      <Text accessibilityLabel="Today/Week/Month toggle locked">🔒 Today/Week/Month (locked)</Text>
    );
  }
  return (
    <View>
      <SegmentControl
        options={[
          { key: 'today', label: 'Today' },
          { key: 'week', label: 'Week' },
          { key: 'month', label: 'Month' }
        ]}
      />
    </View>
  );
}
