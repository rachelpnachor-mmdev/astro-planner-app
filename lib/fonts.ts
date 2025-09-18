// lib/fonts.ts
import * as Font from 'expo-font';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';

export const loadFonts = async () => {
  await Font.loadAsync({
    // Google Fonts
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,

    // Local fonts for astronomical symbols
    'DejaVuSans': require('../fonts/DejaVuSans.ttf'),
    'Symbola': require('../fonts/Symbola.ttf'),
  });
};

// Font families to use for different text types
export const FONTS = {
  // For astronomical symbols (planets, signs)
  symbols: 'Symbola',

  // For chart text and labels
  ui: 'Roboto-Regular',
  uiMedium: 'Roboto-Medium',
  uiBold: 'Roboto-Bold',

  // Fallback for symbols if needed
  symbolsFallback: 'DejaVuSans',
} as const;

export type FontFamily = typeof FONTS[keyof typeof FONTS];