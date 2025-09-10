
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import CreativeFlow from '../components/sections/Horoscope/CreativeFlow';
import FocusOfDay from '../components/sections/Horoscope/FocusOfDay';
import TaskList from '../components/sections/Horoscope/TaskList';
import TodayToggle from '../components/sections/Horoscope/TodayToggle';
import TransitSummary from '../components/sections/Horoscope/TransitSummary';
import UpcomingEvents from '../components/sections/Horoscope/UpcomingEvents';
import { useEntitlement } from '../context/EntitlementContext';

const { width } = Dimensions.get('window');

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
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, marginTop: 24, marginLeft: 24 },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  section: { justifyContent: 'center', alignItems: 'flex-start', padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
});


const SECTION_COMPONENTS = [
  TodayToggle,
  TransitSummary,
  FocusOfDay,
  TaskList,
  CreativeFlow,
  UpcomingEvents,
];

const SECTION_LABELS = [
  'Today/Week/Month toggle (segmented control)',
  'Transit Summary',
  'Focus of the Day (Do/Don’t/Opportunities/Warnings)',
  'Task List',
  'Creative Flow (locked unless Goals Package)',
  'Upcoming Events',
];


export default function HoroscopeScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);
  const { entitlement, setEntitlement } = useEntitlement();
  // TEMP: Add a button to toggle goals entitlement for Creative Flow testing
  const toggleGoals = () => {
    setEntitlement({
      ...entitlement,
      goals: !entitlement.goals,
    });
  };


  // Determine locked state for each section
  const lockedStates = [
    !entitlement.horoscope, // TodayToggle
    !entitlement.horoscope, // TransitSummary
    !entitlement.horoscope, // FocusOfDay
    !entitlement.horoscope, // TaskList
    !entitlement.goals,     // CreativeFlow (locked unless Goals package)
    !entitlement.horoscope, // UpcomingEvents
  ];

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / width);
    setPage(newPage);
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 }}>
          <Text style={{ fontSize: 28, marginRight: 8 }} accessibilityLabel="Horoscope moon icon">🌙</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }} accessibilityLabel="Horoscope section header">Horoscope</Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={styles.root}
  accessibilityRole="header"
      accessibilityLabel="Horoscope main content"
    >
      <View style={{ alignItems: 'flex-end', marginRight: 16, marginBottom: 4 }}>
        <Button
          title={entitlement.horoscope ? 'Lock Horoscope' : 'Unlock Horoscope'}
          onPress={() => setEntitlement({ ...entitlement, horoscope: !entitlement.horoscope })}
          accessibilityLabel={entitlement.horoscope ? 'Lock Horoscope access' : 'Unlock Horoscope access'}
        />
        <View style={{ height: 8 }} />
        <Button
          title={entitlement.goals ? 'Lock Creative Flow' : 'Unlock Creative Flow'}
          onPress={toggleGoals}
          accessibilityLabel={entitlement.goals ? 'Lock Creative Flow access' : 'Unlock Creative Flow access'}
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
        accessibilityLabel="Horoscope sections scrollable area"
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

