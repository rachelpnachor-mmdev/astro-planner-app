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
  eventCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  eventDate: {
    fontSize: 12,
    fontWeight: '500',
    color: HoroscopeColors.accent,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: HoroscopeColors.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: HoroscopeColors.text2,
    lineHeight: 20,
  },
  eventType: {
    fontSize: 12,
    color: HoroscopeColors.text3,
    marginTop: 8,
    fontStyle: 'italic',
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

export default function UpcomingEvents({ locked = false }: { locked?: boolean }) {
  if (locked) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Upcoming Events</Text>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Upcoming Events (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eventCard}>
          <Text style={styles.eventDate}>Sep 22, 2025</Text>
          <Text style={styles.eventTitle}>Autumn Equinox</Text>
          <Text style={styles.eventDescription}>
            A powerful time for balance and reflection. Perfect for setting intentions for the new season.
          </Text>
          <Text style={styles.eventType}>Seasonal Event</Text>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventDate}>Sep 25, 2025</Text>
          <Text style={styles.eventTitle}>Venus Enters Scorpio</Text>
          <Text style={styles.eventDescription}>
            Deep transformations in relationships and values. Intensity and passion take center stage.
          </Text>
          <Text style={styles.eventType}>Planetary Transit</Text>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventDate}>Oct 2, 2025</Text>
          <Text style={styles.eventTitle}>New Moon in Libra</Text>
          <Text style={styles.eventDescription}>
            Excellent time for new beginnings in partnerships and finding harmony in your life.
          </Text>
          <Text style={styles.eventType}>Lunar Event</Text>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventDate}>Oct 9, 2025</Text>
          <Text style={styles.eventTitle}>Mercury Direct</Text>
          <Text style={styles.eventDescription}>
            Communication flows smoothly again. Safe to sign contracts and make important decisions.
          </Text>
          <Text style={styles.eventType}>Planetary Event</Text>
        </View>
      </ScrollView>
    </View>
  );
}
