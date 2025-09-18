/**
 * Lunaria dark theme palette - consistent across the entire app
 * Based on the astrology/mystical aesthetic with deep blues and cosmic colors
 */

// Lunaria brand colors
const lunariaBlue = '#6AA9FF';
const lunariaDanger = '#FF5C5C';

export const Colors = {
  light: {
    // Light mode (fallback - app primarily uses dark theme)
    text: '#11181C',
    background: '#fff',
    tint: lunariaBlue,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: lunariaBlue,
  },
  dark: {
    // Lunaria dark theme (primary theme)
    text: '#E6EDF3',
    textSub: '#8B96A8',
    background: '#0B1220',  // Deep cosmic background
    backgroundCard: '#141C2F',  // Card/container background
    backgroundElevated: '#1A2332', // Elevated components
    border: '#2A3447',  // Borders and dividers
    tint: lunariaBlue,  // Primary accent color
    danger: lunariaDanger,
    white: '#FFFFFF',
    blackOnWhite: '#0B1220',
    focus: lunariaBlue,
    icon: '#8B96A8',
    tabIconDefault: '#8B96A8',
    tabIconSelected: lunariaBlue,
  },
};

// Export individual Lunaria colors for direct use
export const LunariaColors = {
  bg: '#0B1220',
  card: '#141C2F',
  border: '#2A3447',
  text: '#E6EDF3',
  sub: '#8B96A8',
  white: '#FFFFFF',
  blackOnWhite: '#0B1220',
  danger: '#FF5C5C',
  focus: '#6AA9FF',
};
