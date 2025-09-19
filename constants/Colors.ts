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

// Horoscope Module Color Tokens (as per spec)
export const HoroscopeColors = {
  // Backgrounds
  bg: '#0B0F14',           // space black
  surface: '#0F1624',      // deep navy
  card: '#111A2A',         // card background
  cardSubtle: '#0D1420',   // card subtle
  line: '#1E2A44',         // dividers/hairlines

  // Accents
  accent: '#E7C888',       // celestial gold
  accentEmph: '#F0D79E',   // accent hover/active
  accent2: '#33D2C5',      // secondary accent (aqua)
  accent3: '#6EA8FF',      // tertiary accent (indigo)

  // Text
  text: '#F5F7FA',         // text high
  text2: '#CBD5E1',        // text secondary
  text3: '#94A3B8',        // text muted
  disabled: '#5B6B82',     // disabled

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  // Planetary glyph colors (optional, subtle)
  planetarySun: '#F4C84B',
  planetaryMoon: '#9BB7FF',
  planetaryMercury: '#A0AEC0',
  planetaryVenus: '#F5A3B8',
  planetaryMars: '#FF6A6A',
  planetaryJupiter: '#F59E0B',
  planetarySaturn: '#C5B38C',
  planetaryUranus: '#60A5FA',
  planetaryNeptune: '#7DD3FC',
  planetaryPluto: '#A78BFA',
};
