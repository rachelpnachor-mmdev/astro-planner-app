import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HoroscopeColors } from '../../../constants/Colors';

const RITUAL_STEPS = [
  "Anoint palms with Earth Oil",
  "Light Incense and cleanse altar",
  "Pass incense around your workspace equipment",
  "Hold Amazonite in left hand",
  "Hover right hand over clear quartz",
  "State \"I dedicate my systems to ease\"",
  "Imagine and set the intention that your work systems will align and streamline"
];

export default function RitualGuide({ locked = false }: { locked?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Ritual Guide (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Ritual Guide</Text>

        <View style={styles.timeCard}>
          <Text style={styles.timeLabel}>Best Time:</Text>
          <Text style={styles.timeText}>7PM</Text>
        </View>

        <TouchableOpacity
          style={styles.expandableCard}
          onPress={() => setExpanded(!expanded)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Step-by-Step Instructions</Text>
            <Feather
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={HoroscopeColors.accent}
            />
          </View>

          {expanded && (
            <View style={styles.stepsContainer}>
              {RITUAL_STEPS.map((step, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stepItem}
                  onPress={() => toggleStep(index)}
                >
                  <View style={styles.stepRow}>
                    <View style={[
                      styles.checkbox,
                      completedSteps.has(index) && styles.checkboxChecked
                    ]}>
                      {completedSteps.has(index) && (
                        <Feather name="check" size={14} color={HoroscopeColors.bg} />
                      )}
                    </View>
                    <Text style={[
                      styles.stepText,
                      completedSteps.has(index) && styles.stepTextCompleted
                    ]}>
                      Step {index + 1}: {step}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>
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
  timeCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: HoroscopeColors.text2,
    marginRight: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: HoroscopeColors.accent,
  },
  expandableCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: HoroscopeColors.text,
  },
  stepsContainer: {
    marginTop: 16,
    gap: 12,
  },
  stepItem: {
    paddingVertical: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: HoroscopeColors.text3,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: HoroscopeColors.accent,
    borderColor: HoroscopeColors.accent,
  },
  stepText: {
    fontSize: 15,
    color: HoroscopeColors.text2,
    lineHeight: 22,
    flex: 1,
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: HoroscopeColors.text3,
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
