import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { HoroscopeColors } from '../../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: HoroscopeColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  transitCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  transitTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: HoroscopeColors.accent,
    marginBottom: 8,
  },
  transitDescription: {
    fontSize: 14,
    color: HoroscopeColors.text2,
    lineHeight: 20,
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
  },
});

export default function TransitSummary({ locked = false }: { locked?: boolean }) {
  if (locked) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Transit Summary</Text>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Transit Summary (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transit Summary</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.transitCard}>
          <Text style={styles.transitTitle}>Current Major Transits</Text>
          <Text style={styles.transitDescription}>
            Jupiter is making harmonious aspects to your natal planets, bringing opportunities for growth and expansion in career matters.
          </Text>
        </View>

        <View style={styles.transitCard}>
          <Text style={styles.transitTitle}>Mercury Retrograde Effects</Text>
          <Text style={styles.transitDescription}>
            Communication and technology may experience delays. Double-check important messages and backup your data.
          </Text>
        </View>

        <View style={styles.transitCard}>
          <Text style={styles.transitTitle}>Lunar Influence</Text>
          <Text style={styles.transitDescription}>
            The current lunar phase enhances intuition and emotional clarity. Trust your instincts in personal relationships.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
