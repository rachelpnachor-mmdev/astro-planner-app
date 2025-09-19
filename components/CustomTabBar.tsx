import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HoroscopeColors } from '../constants/Colors';

const TAB_CONFIG = [
  {
    name: 'Horoscope',
    emoji: '🌙',
    label: 'Horoscope',
  },
  {
    name: 'Rituals',
    emoji: '🔮',
    label: 'Rituals',
  },
  {
    name: 'Apothecary',
    emoji: '🥄',
    label: 'Kitchen & Home',
  },
  {
    name: 'Goals',
    emoji: '⭐',
    label: 'Goals',
  },
  {
    name: 'BOS',
    emoji: '📖',
    label: 'Reflections',
  },
];

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TAB_CONFIG.find(t => t.name === route.name);
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={`${tab?.emoji} ${tab?.label} tab${focused ? ', selected' : ''}`}
            onPress={() => {
              if (!focused) {
                navigation.navigate(route.name);
              }
            }}
            style={[styles.tab, focused ? styles.tabActive : styles.tabInactive]}
          >
            <View style={styles.iconLabelRow}>
              <Text
                style={[styles.emoji, { color: focused ? HoroscopeColors.accent : HoroscopeColors.text3 }]}
                accessibilityRole="image"
                accessibilityLabel={`${tab?.emoji} icon for ${tab?.label}`}
              >
                {tab?.emoji}
              </Text>
              {focused && (
                <Animated.Text
                  style={styles.label}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  accessibilityRole="text"
                  accessibilityLabel={`${tab?.label} label`}
                >
                  {tab?.label}
                </Animated.Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: HoroscopeColors.surface,
    borderTopWidth: 0.5,
    borderColor: HoroscopeColors.line,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flexShrink: 1,
    flexGrow: 0,
    minWidth: 48,
    maxWidth: 120,
    position: 'relative',
  },
  tabActive: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 80,
    maxWidth: 180,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: HoroscopeColors.accent,
    shadowColor: HoroscopeColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  tabInactive: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 48,
    maxWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: HoroscopeColors.text,
    maxWidth: 100,
    lineHeight: 18,
    textAlign: 'left',
  },
});
