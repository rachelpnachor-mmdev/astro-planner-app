import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import Chores from '../components/sections/KitchenHome/Chores';
import Meals from '../components/sections/KitchenHome/Meals';
import MixedUnlock from '../components/sections/KitchenHome/MixedUnlock';
import { useNavigation } from '@react-navigation/native';
import { useEntitlement } from '../context/EntitlementContext';
import { LunariaColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const SECTION_COMPONENTS = [
  Chores,
  Meals,
  MixedUnlock,
];

const SECTION_LABELS = [
  'Chores (Indoor Large, Indoor Small, Outdoor, Laundry, Plants, Projects)',
  'Meals (Lunch, Dinner, Snacks/Tea, Shopping List)',
  'Shopping list Today/This week (segmented control)',
];

export default function KitchenHomeScreen() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);
  const navigation = useNavigation();
  
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 }}>
          <Text style={{ fontSize: 28, marginRight: 8 }}>🍲</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Kitchen & Home</Text>
        </View>
      ),
    });
  }, [navigation]);
  const { entitlement, setEntitlement } = useEntitlement();

  // Toggle handlers for Chores and Meals
  const toggleChores = () => {
    setEntitlement({
      ...entitlement,
      kitchenHome: {
        ...entitlement.kitchenHome,
        chores: !entitlement.kitchenHome.chores,
      },
    });
  };
  const toggleMeals = () => {
    setEntitlement({
      ...entitlement,
      kitchenHome: {
        ...entitlement.kitchenHome,
        meals: !entitlement.kitchenHome.meals,
      },
    });
  };

  // Determine locked state for each section
  const lockedStates = [
    !entitlement.kitchenHome.chores, // Chores
    !entitlement.kitchenHome.meals,  // Meals
    !entitlement.kitchenHome.meals,  // Shopping list locked unless Meals is unlocked
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
      accessibilityLabel="Kitchen & Home main content"
    >
      <View style={{ alignItems: 'flex-end', marginRight: 16, marginBottom: 4 }}>
        <Button
          title={entitlement.kitchenHome.chores ? 'Lock Chores' : 'Unlock Chores'}
          onPress={toggleChores}
        />
        <View style={{ height: 8 }} />
        <Button
          title={entitlement.kitchenHome.meals ? 'Lock Meals' : 'Unlock Meals'}
          onPress={toggleMeals}
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
        accessibilityLabel="Kitchen & Home sections scrollable area"
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
    color: LunariaColors.sub,
    fontStyle: 'italic',
    maxWidth: width * 0.45,
  },
  root: { flex: 1, backgroundColor: LunariaColors.bg },
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
    backgroundColor: LunariaColors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: LunariaColors.focus,
  },
  section: { justifyContent: 'center', alignItems: 'flex-start', padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
});
