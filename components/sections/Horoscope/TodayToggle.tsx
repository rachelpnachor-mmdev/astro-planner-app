import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { SegmentControl } from '../../SegmentControl';
import { HoroscopeColors } from '../../../constants/Colors';
import { useEntitlement } from '../../../context/EntitlementContext';
import AdPlaceholder from '../../AdPlaceholder';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  toggleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleWrapper: {
    width: '90%',
    maxWidth: 600,
  },
  content: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: HoroscopeColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  horoscopeCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  horoscopeText: {
    fontSize: 16,
    color: HoroscopeColors.text2,
    lineHeight: 24,
    marginBottom: 16,
  },
  themePhrase: {
    fontSize: 14,
    fontWeight: '500',
    color: HoroscopeColors.accent,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HoroscopeColors.cardSubtle,
    borderRadius: 12,
    padding: 32,
    marginVertical: 20,
  },
  lockedText: {
    fontSize: 16,
    color: HoroscopeColors.text3,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default function TodayToggle({ locked = false }: { locked?: boolean }) {
  const { entitlement } = useEntitlement();
  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleWrapper}>
            <SegmentControl
              options={[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' }
              ]}
              theme={{
                background: HoroscopeColors.surface,        // container (deep navy)
                selectedBackground: HoroscopeColors.card,   // selected pill (darker navy)
                border: HoroscopeColors.line,               // soft navy outline
                text: HoroscopeColors.text2,                // unselected text (starlight)
                selectedText: HoroscopeColors.text,         // selected text (moon-white)
                thumb: HoroscopeColors.card                 // (optional) keep the thumb same as selected pill
              }}
              persistenceKey="todayToggle"
            />
          </View>
        </View>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Horoscope Content (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleWrapper}>
          <SegmentControl
            options={[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' }
            ]}
            theme={{
              background: HoroscopeColors.surface,        // container (deep navy)
              selectedBackground: HoroscopeColors.card,   // selected pill (darker navy)
              border: HoroscopeColors.line,               // soft navy outline
              text: HoroscopeColors.text2,                // unselected text (starlight)
              selectedText: HoroscopeColors.text,         // selected text (moon-white)
              thumb: HoroscopeColors.card                 // (optional) keep the thumb same as selected pill
            }}
            persistenceKey="todayToggle"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Today's Horoscope</Text>

        <View style={styles.horoscopeCard}>
          <Text style={styles.horoscopeText}>
            The celestial energies today encourage you to trust your intuition and embrace new opportunities.
            Jupiter's harmonious aspect to your Sun brings optimism and growth potential.
            Focus on communication and collaboration - your ideas have the power to inspire others.
            A chance encounter may lead to unexpected insights about your path forward.
          </Text>
          <Text style={styles.themePhrase}>"Trust the cosmic rhythm and let your inner wisdom guide you."</Text>
        </View>

        {entitlement.showAds && (
          <AdPlaceholder type="banner" testID="horoscope-banner-ad" />
        )}

        <View style={styles.horoscopeCard}>
          <Text style={styles.horoscopeText}>
            This is an excellent time for creative endeavors and self-expression.
            The Moon's position enhances your emotional intelligence and helps you connect deeply with others.
            Pay attention to synchronicities and signs from the universe - they're pointing you toward your highest good.
          </Text>
          <Text style={styles.themePhrase}>"Your authentic self is your greatest treasure."</Text>
        </View>
      </ScrollView>
    </View>
  );
}
