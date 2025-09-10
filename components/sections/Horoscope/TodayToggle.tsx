import { Text, View } from 'react-native';
import { SegmentControl } from '../../SegmentControl';

export default function TodayToggle({ locked = false }: { locked?: boolean }) {
  if (locked) {
    return (
      <Text accessibilityLabel="Today/Week/Month toggle locked">🔒 Today/Week/Month (locked)</Text>
    );
  }
  return (
    <View style={{ width: '100%', alignItems: 'center', marginTop: 0 }}>
      <View style={{ width: '90%', maxWidth: 600 }}>
        <SegmentControl
          options={[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' }
          ]}
          theme={{
            background: '#193364ff',        // container (deep navy)
            selectedBackground: '#0B1220',// selected pill (darker navy)
            border: '#25324A',            // soft navy outline
            text: '#D5DBE8',              // unselected text (starlight)
            selectedText: '#FFFFFF',      // selected text (moon-white)
            thumb: '#0B1220'              // (optional) keep the thumb same as selected pill
          }}
          persistenceKey="todayToggle"
        />
      </View>
      {/* ...other content for TodayToggle can go below here if needed... */}
    </View>
  );
}
