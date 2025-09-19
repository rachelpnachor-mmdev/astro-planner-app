import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HoroscopeColors } from '../../../constants/Colors';

const WEEKLY_INVENTORY_DATA = {
  Candles: [
    "2 Blue Taper",
    "1 Green tealight",
    "1 Yellow Chime"
  ],
  Oils: [
    "Earth Oil",
    "Lavender Oil",
    "Rose Oil"
  ],
  Incense: [
    "Frankincense (stick)",
    "Rose (Cone)",
    "Sandalwood (powder)"
  ],
  Stones: [
    "Amazonite Tumble",
    "Lapis Palm",
    "Hematite Raw"
  ]
};

export default function WeeklyInventory({ locked = false }: { locked?: boolean }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Candles']));
  const [checkedItems, setCheckedItems] = useState(new Set<string>());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleItem = (category: string, itemIndex: number) => {
    const itemKey = `${category}-${itemIndex}`;
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemKey)) {
      newChecked.delete(itemKey);
    } else {
      newChecked.add(itemKey);
    }
    setCheckedItems(newChecked);
  };

  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Weekly Inventory (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Weekly Inventory</Text>
        <Text style={styles.subtitle}>Items needed for this week (Sunday → Saturday)</Text>

        {Object.entries(WEEKLY_INVENTORY_DATA).map(([category, items]) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryCard}
            onPress={() => toggleCategory(category)}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Feather
                name={expandedCategories.has(category) ? "chevron-up" : "chevron-down"}
                size={20}
                color={HoroscopeColors.accent}
              />
            </View>

            {expandedCategories.has(category) && (
              <View style={styles.itemsContainer}>
                {items.map((item, index) => {
                  const itemKey = `${category}-${index}`;
                  const isChecked = checkedItems.has(itemKey);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.itemRow}
                      onPress={() => toggleItem(category, index)}
                    >
                      <View style={styles.itemContent}>
                        <View style={[
                          styles.checkbox,
                          isChecked && styles.checkboxChecked
                        ]}>
                          {isChecked && (
                            <Feather name="check" size={14} color={HoroscopeColors.bg} />
                          )}
                        </View>
                        <Text style={[
                          styles.itemText,
                          isChecked && styles.itemTextCompleted
                        ]}>
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </TouchableOpacity>
        ))}
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: HoroscopeColors.text2,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categoryCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: HoroscopeColors.text,
  },
  itemsContainer: {
    marginTop: 12,
    gap: 8,
  },
  itemRow: {
    paddingVertical: 4,
  },
  itemContent: {
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
  itemText: {
    fontSize: 15,
    color: HoroscopeColors.text2,
    lineHeight: 20,
    flex: 1,
  },
  itemTextCompleted: {
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
