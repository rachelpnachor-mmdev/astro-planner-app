import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HoroscopeColors } from '../../../constants/Colors';

const DAILY_RITUAL_DATA = {
  title: "Moon in Virgo Ritual",
  tools: [
    "1 Green Chime",
    "Earth Oil",
    "1 Amazonite tumble",
    "1 Clear Quartz point",
    "Sandalwood/Evergreen"
  ]
};

export default function DailyKit({ locked = false }: { locked?: boolean }) {
  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Daily Ritual (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Daily Ritual</Text>

        <View style={styles.ritualCard}>
          <Text style={styles.ritualTitle}>{DAILY_RITUAL_DATA.title}</Text>

          <View style={styles.toolsSection}>
            <Text style={styles.toolsHeader}>Tools Needed:</Text>
            <View style={styles.toolsGrid}>
              {DAILY_RITUAL_DATA.tools.map((tool, index) => (
                <View key={index} style={styles.toolItem}>
                  <Text style={styles.toolText}>• {tool}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
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
  ritualCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  ritualTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: HoroscopeColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  toolsSection: {
    marginTop: 8,
  },
  toolsHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: HoroscopeColors.accent,
    marginBottom: 12,
  },
  toolsGrid: {
    gap: 8,
  },
  toolItem: {
    paddingVertical: 4,
  },
  toolText: {
    fontSize: 15,
    color: HoroscopeColors.text2,
    lineHeight: 22,
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
