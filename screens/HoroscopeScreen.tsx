
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, StatusBar, Pressable, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TodayToggle from '../components/sections/Horoscope/TodayToggle';
import TransitSummary from '../components/sections/Horoscope/TransitSummary';
import UpcomingEvents from '../components/sections/Horoscope/UpcomingEvents';
import { useEntitlement } from '../context/EntitlementContext';
import { HoroscopeColors } from '../constants/Colors';
import StarfieldBackground from '../components/StarfieldBackground';
import HamburgerMenu from '../components/HamburgerMenu';

const { width } = Dimensions.get('window');

// Pre-load the header logo (transparent version)
const headerLogo = require('../assets/images/LunariaLogoHeader.png');

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HoroscopeColors.bg
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  panel: {
    width,
    flex: 1,
    paddingHorizontal: 10, // Small horizontal margin for readability
    paddingTop: 125, // More space to clear the logo area
    paddingBottom: 35, // Even less bottom space for max content
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0, // At the very bottom to see positioning
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: 12,
  },
  indicator: {
    padding: 8,
    marginHorizontal: 4,
  },
  indicatorActive: {
    // Active state handled by dot styling
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: HoroscopeColors.text3,
    opacity: 0.4,
  },
  dotActive: {
    backgroundColor: HoroscopeColors.accent,
    opacity: 1,
    shadowColor: HoroscopeColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  logoFixed: {
    position: 'absolute',
    top: 25,
    left: -90,
    height: 80, // Another 10% larger (73 * 1.10)
    width: 374, // Another 10% larger (340 * 1.10)
    zIndex: 100,
  },
  previewContainer: {
    position: 'absolute',
    top: 100,
    zIndex: 50,
    backgroundColor: 'rgba(11, 15, 20, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewLeft: {
    left: 10,
  },
  previewRight: {
    right: 10,
  },
  previewText: {
    color: HoroscopeColors.text,
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 6,
  },
  previewArrow: {
    color: HoroscopeColors.accent,
  },
});


// New 3-panel structure as per spec
const SECTION_COMPONENTS = [
  TodayToggle,      // Panel 1: Horoscope (includes segmented control)
  TransitSummary,   // Panel 2: Transit Summary
  UpcomingEvents,   // Panel 3: Upcoming Events
];

const SECTION_LABELS = [
  'Horoscope',
  'Transit Summary',
  'Upcoming Events',
];


export default function HoroscopeScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const scrollRef = useRef(null);
  const { entitlement } = useEntitlement();

  // Preload logo for instant display
  useEffect(() => {
    const preloadLogo = async () => {
      try {
        await Image.prefetch(Image.resolveAssetSource(headerLogo).uri);
        setLogoLoaded(true);
      } catch (error) {
        console.warn('Logo preload failed:', error);
        setLogoLoaded(true); // Still show the logo even if preload fails
      }
    };
    preloadLogo();
  }, []);

  // Determine locked state for each section
  const lockedStates = [
    !entitlement.horoscope, // Horoscope panel
    !entitlement.horoscope, // Transit Summary
    !entitlement.horoscope, // Upcoming Events
  ];

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / width);
    setPage(newPage);
  };

  const navigateToPanel = (panelIndex: number) => {
    scrollRef.current?.scrollTo({
      x: panelIndex * width,
      animated: true,
    });
    setPage(panelIndex);
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        height: 60,
      },
      headerBackground: () => (
        <View style={{
          flex: 1,
          backgroundColor: 'transparent'
        }} />
      ),
      headerTransparent: true,
      headerTintColor: HoroscopeColors.text,
      headerTitle: () => null,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setIsMenuVisible(true)}
          style={{
            marginRight: 12,
            backgroundColor: 'rgba(11, 15, 20, 0.8)',
            padding: 10,
            borderRadius: 12,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Feather name="menu" size={22} color={HoroscopeColors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={HoroscopeColors.bg} />

      {/* Starfield Background */}
      <View style={StyleSheet.absoluteFill}>
        <StarfieldBackground />
      </View>

      {/* Horizontal Scrolling Panels */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        accessibilityRole="scrollbar"
        accessibilityLabel="Horoscope panels scrollable area"
      >
        {SECTION_COMPONENTS.map((SectionComponent, idx) => (
          <View key={idx} style={styles.panel}>
            <SectionComponent locked={lockedStates[idx]} />
          </View>
        ))}
      </ScrollView>

      {/* Fixed Logo */}
      {logoLoaded && (
        <ImageBackground
          source={headerLogo}
          style={styles.logoFixed}
          resizeMode="contain"
          imageStyle={{
            alignSelf: 'flex-start',
            marginLeft: 0,
            left: 0
          }}
          cache="force-cache"
        />
      )}

      {/* Navigation Preview Indicators */}
      {page > 0 && (
        <TouchableOpacity
          style={[styles.previewContainer, styles.previewLeft]}
          onPress={() => navigateToPanel(page - 1)}
          accessibilityLabel={`Previous: ${SECTION_LABELS[page - 1]}`}
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={16} style={styles.previewArrow} />
          <Text style={styles.previewText}>{SECTION_LABELS[page - 1]}</Text>
        </TouchableOpacity>
      )}

      {page < SECTION_COMPONENTS.length - 1 && (
        <TouchableOpacity
          style={[styles.previewContainer, styles.previewRight]}
          onPress={() => navigateToPanel(page + 1)}
          accessibilityLabel={`Next: ${SECTION_LABELS[page + 1]}`}
          accessibilityRole="button"
        >
          <Text style={styles.previewText}>{SECTION_LABELS[page + 1]}</Text>
          <Feather name="chevron-right" size={16} style={styles.previewArrow} />
        </TouchableOpacity>
      )}

      {/* Panel Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {SECTION_COMPONENTS.map((_, idx) => {
          const isActive = page === idx;
          return (
            <Pressable
              key={idx}
              style={[
                styles.indicator,
                isActive && styles.indicatorActive,
              ]}
              onPress={() => navigateToPanel(idx)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${SECTION_LABELS[idx]} panel`}
            >
              <View style={[
                styles.dot,
                isActive && styles.dotActive,
              ]} />
            </Pressable>
          );
        })}
      </View>

      {/* Hamburger Menu */}
      <HamburgerMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </View>
  );
}

