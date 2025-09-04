import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import DailyGoalTasks from '../components/sections/Goals/DailyGoalTasks';
import Affirmation from '../components/sections/Goals/Affirmation';
import FamilyRoutines from '../components/sections/Goals/FamilyRoutines';
import WitchyGoals from '../components/sections/Goals/WitchyGoals';
import CareerContext from '../components/sections/Goals/CareerContext';
import { useEntitlement } from '../context/EntitlementContext';

const { width } = Dimensions.get('window');

const SECTION_COMPONENTS = [
  DailyGoalTasks,
  Affirmation,
  FamilyRoutines,
  WitchyGoals,
  CareerContext,
];

const SECTION_LABELS = [
  'Daily Goal Tasks',
  'Affirmation of the Day',
  'Family Routines (e.g., game night, movie night)',
  'Witchy Goals (themes like Protection, Healing, Abundance)',
  'Career Context',
];

export default function GoalsScreen() {
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 }}>
          <Text style={{ fontSize: 28, marginRight: 8 }} accessibilityLabel="Goals target icon">🎯</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }} accessibilityLabel="Goals section header">Goals</Text>
        </View>
      ),
    });
  }, [navigation]);
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);
  const { entitlement, setEntitlement } = useEntitlement();

  // Toggle handler for goals package
  const toggleGoals = () => {
    setEntitlement({
      ...entitlement,
      goals: !entitlement.goals,
    });
  };

  // All sections locked unless goals entitlement is true
  const lockedStates = [
    !entitlement.goals,
    !entitlement.goals,
    !entitlement.goals,
    !entitlement.goals,
    !entitlement.goals,
  ];

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / width);
    setPage(newPage);
  };

  return (
    <View
      style={styles.root}
      accessibilityRole="header"
      accessibilityLabel="Goals main content"
    >
      <View style={{ alignItems: 'flex-end', marginRight: 16, marginBottom: 4 }}>
        <Button
          title={entitlement.goals ? 'Lock Goals' : 'Unlock Goals'}
          onPress={toggleGoals}
          accessibilityLabel={entitlement.goals ? 'Lock Goals access' : 'Unlock Goals access'}
        />
      </View>
      <View style={styles.labelPreviewRow}>
        <View style={styles.labelPreviewLeft}>
          {page > 0 && (
            <Text style={styles.labelPreviewText} numberOfLines={1}>
              ← {SECTION_LABELS[page - 1]}
            </Text>
          )}
        </View>
        <View style={styles.labelPreviewRight}>
          {page < SECTION_LABELS.length - 1 && (
            <Text style={styles.labelPreviewText} numberOfLines={1}>
              {SECTION_LABELS[page + 1]} →
            </Text>
          )}
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        accessibilityRole="scrollbar"
        accessibilityLabel="Goals sections scrollable area"
      >
        {SECTION_COMPONENTS.map((SectionComponent, idx) => (
          <View key={idx} style={[styles.section, { width }]}> 
            <SectionComponent locked={lockedStates[idx]} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorRow}>
        {SECTION_COMPONENTS.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, page === idx && styles.dotActive]}
            accessibilityRole="adjustable"
            accessibilityLabel={`Page indicator dot ${idx + 1} of ${SECTION_COMPONENTS.length}${page === idx ? ' (current page)' : ''}`}
            accessibilityState={{ selected: page === idx }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
    minHeight: 18,
  },
  labelPreviewLeft: {
    flex: 1,
    alignItems: 'flex-start',
    opacity: 0.5,
    minWidth: 0,
  },
  labelPreviewRight: {
    flex: 1,
    alignItems: 'flex-end',
    opacity: 0.5,
    minWidth: 0,
  },
  labelPreviewText: {
    fontSize: 13,
    color: '#444',
    fontStyle: 'italic',
    maxWidth: width * 0.45,
  },
  root: { flex: 1, backgroundColor: '#fff' },
  container: { alignItems: 'center' },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 24,
    marginLeft: 24,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#222',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 24,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
});
