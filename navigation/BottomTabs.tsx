import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import HamburgerMenu from '../components/HamburgerMenu';
import GoalsScreen from '../screens/GoalsScreen';
import HoroscopeScreen from '../screens/HoroscopeScreen';
import KitchenHomeScreen from '../screens/KitchenHomeScreen';
import ReflectionsScreen from '../screens/ReflectionsScreen';
import RitualsScreen from '../screens/RitualsScreen';
import { HoroscopeColors } from '../constants/Colors';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  {
    name: 'Horoscope',
    component: HoroscopeScreen,
    icon: (focused: boolean) => <MaterialCommunityIcons name="moon-waning-crescent" size={24} color={focused ? HoroscopeColors.accent : HoroscopeColors.text3} />,
    label: 'Horoscope',
    emoji: '🌙',
  },
  {
    name: 'Rituals',
    component: RitualsScreen,
    icon: (focused: boolean) => <MaterialCommunityIcons name="crystal-ball" size={24} color={focused ? HoroscopeColors.accent : HoroscopeColors.text3} />,
    label: 'Rituals',
    emoji: '🔮',
  },
  {
    name: 'Apothecary',
    component: KitchenHomeScreen,
    icon: (focused: boolean) => <MaterialCommunityIcons name="mortar-pestle" size={22} color={focused ? HoroscopeColors.accent : HoroscopeColors.text3} />,
    label: 'Kitchen & Home',
    emoji: '🔮',
  },
  {
    name: 'Goals',
    component: GoalsScreen,
    icon: (focused: boolean) => <MaterialCommunityIcons name="star-shooting" size={22} color={focused ? HoroscopeColors.accent : HoroscopeColors.text3} />,
    label: 'Goals',
    emoji: '⭐',
  },
  {
    name: 'BOS',
    component: ReflectionsScreen,
    icon: (focused: boolean) => <Ionicons name="book-outline" size={22} color={focused ? HoroscopeColors.accent : HoroscopeColors.text3} />,
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
              <Feather name="menu" size={26} color={HoroscopeColors.text} />
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
