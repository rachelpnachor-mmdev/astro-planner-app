import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HoroscopeScreen from '../screens/HoroscopeScreen';
import RitualsScreen from '../screens/RitualsScreen';
import KitchenHomeScreen from '../screens/KitchenHomeScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ReflectionsScreen from '../screens/ReflectionsScreen';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import HamburgerMenu from '../components/HamburgerMenu';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  {
    name: 'Horoscope',
    component: HoroscopeScreen,
  icon: (focused: boolean) => <MaterialCommunityIcons name="moon-waning-crescent" size={24} color={focused ? '#222' : '#888'} />,
    label: 'Horoscope',
    emoji: '🌙',
  },
  {
    name: 'Rituals',
    component: RitualsScreen,
  icon: (focused: boolean) => <MaterialCommunityIcons name="crystal-ball" size={24} color={focused ? '#222' : '#888'} />,
    label: 'Rituals',
    emoji: '🔮',
  },
  {
    name: 'KitchenHome',
    component: KitchenHomeScreen,
  icon: (focused: boolean) => <FontAwesome5 name="utensils" size={22} color={focused ? '#222' : '#888'} />,
    label: 'Kitchen & Home',
    emoji: '🍲',
  },
  {
    name: 'Goals',
    component: GoalsScreen,
  icon: (focused: boolean) => <Feather name="target" size={22} color={focused ? '#222' : '#888'} />,
    label: 'Goals',
    emoji: '🎯',
  },
  {
    name: 'Reflections',
    component: ReflectionsScreen,
  icon: (focused: boolean) => <Ionicons name="book-outline" size={22} color={focused ? '#222' : '#888'} />,
    label: 'Reflections',
    emoji: '📖',
  },
];

export default function BottomTabs() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <Tab.Navigator
        initialRouteName="Horoscope"
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'left',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => setMenuVisible(true)}
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <Feather name="menu" size={26} color="#222" />
            </TouchableOpacity>
          ),
        }}
      >
        {TAB_CONFIG.map(tab => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
