
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import DailyKit from '../components/sections/Rituals/DailyKit';
import RitualGuide from '../components/sections/Rituals/RitualGuide';
import WeeklyInventory from '../components/sections/Rituals/WeeklyInventory';
import NotesAdaptations from '../components/sections/Rituals/NotesAdaptations';
import { useEntitlement } from '../context/EntitlementContext';

const { width } = Dimensions.get('window');

const SECTION_COMPONENTS = [
  DailyKit,
  RitualGuide,
  WeeklyInventory,
  NotesAdaptations,
];

const SECTION_LABELS = [
  'Daily Kit (checklist)',
  'Ritual Guide (step-by-step)',
  'Weekly Inventory (Checklist of supplies for the week)',
  'Notes/Adaptations',
];

export default function RitualsScreen() {
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 }}>
          <Text style={{ fontSize: 28, marginRight: 8 }} accessibilityLabel="Rituals crystal ball icon">🔮</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }} accessibilityLabel="Rituals section header">Rituals</Text>
        </View>
      ),
    });
  }, [navigation]);
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);
  const { entitlement, setEntitlement } = useEntitlement();

  // TEMP: Add toggle buttons for rituals and weekly inventory (witch package)
  const toggleRituals = () => {
    setEntitlement({
      ...entitlement,
      rituals: !entitlement.rituals,
    });
  };
  // No separate witch package; rituals is the witch package

  // Determine locked state for each section
  const lockedStates = [
    !entitlement.rituals, // DailyKit
    !entitlement.rituals, // RitualGuide
    !entitlement.rituals, // WeeklyInventory (locked unless Rituals/Witch Package)
    !entitlement.rituals, // NotesAdaptations
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
      accessibilityLabel="Rituals main content"
    >
      <View style={{ alignItems: 'flex-end', marginRight: 16, marginBottom: 4 }}>
           <Button
             title={entitlement.rituals ? 'Lock Rituals (Witch)' : 'Unlock Rituals (Witch)'}
             onPress={toggleRituals}
             
             accessibilityLabel={entitlement.rituals ? 'Lock Rituals access' : 'Unlock Rituals access'}
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
        accessibilityLabel="Rituals sections scrollable area"
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
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, marginTop: 24, marginLeft: 24 },
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
  section: { justifyContent: 'center', alignItems: 'flex-start', padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
});
