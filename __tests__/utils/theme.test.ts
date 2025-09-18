// __tests__/utils/theme.test.ts
import { Colors, LunariaColors } from '../../constants/Colors';

describe('Theme System', () => {
  describe('Colors', () => {
    it('should have both light and dark themes', () => {
      expect(Colors.light).toBeDefined();
      expect(Colors.dark).toBeDefined();
    });

    it('should have consistent color properties', () => {
      const requiredProperties = ['text', 'background', 'tint', 'icon', 'tabIconDefault', 'tabIconSelected'];

      requiredProperties.forEach(prop => {
        expect(Colors.light).toHaveProperty(prop);
        expect(Colors.dark).toHaveProperty(prop);
      });
    });

    it('should have valid hex color values', () => {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      Object.values(Colors.light).forEach(color => {
        if (typeof color === 'string') {
          expect(color).toMatch(hexColorRegex);
        }
      });

      Object.values(Colors.dark).forEach(color => {
        if (typeof color === 'string') {
          expect(color).toMatch(hexColorRegex);
        }
      });
    });

    it('should have Lunaria-specific dark theme properties', () => {
      expect(Colors.dark).toHaveProperty('textSub');
      expect(Colors.dark).toHaveProperty('backgroundCard');
      expect(Colors.dark).toHaveProperty('backgroundElevated');
      expect(Colors.dark).toHaveProperty('border');
      expect(Colors.dark).toHaveProperty('danger');
      expect(Colors.dark).toHaveProperty('white');
      expect(Colors.dark).toHaveProperty('blackOnWhite');
      expect(Colors.dark).toHaveProperty('focus');
    });
  });

  describe('LunariaColors', () => {
    it('should have all required Lunaria theme colors', () => {
      const requiredColors = ['bg', 'card', 'border', 'text', 'sub', 'white', 'blackOnWhite', 'danger', 'focus'];

      requiredColors.forEach(color => {
        expect(LunariaColors).toHaveProperty(color);
      });
    });

    it('should have valid hex color values', () => {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      Object.values(LunariaColors).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should use cosmic/dark theme colors', () => {
      // Background should be very dark (cosmic)
      expect(LunariaColors.bg).toBe('#0B1220');

      // Card background should be darker than regular background
      expect(LunariaColors.card).toBe('#141C2F');

      // Text should be light for dark background
      expect(LunariaColors.text).toBe('#E6EDF3');

      // Focus color should be the Lunaria blue
      expect(LunariaColors.focus).toBe('#6AA9FF');
    });

    it('should maintain proper contrast ratios', () => {
      // These colors should provide good contrast
      // (This is a simplified check - in practice you'd calculate actual contrast ratios)

      // Background is very dark
      expect(LunariaColors.bg.toLowerCase()).toMatch(/^#[0-3]/);

      // Text is light
      expect(LunariaColors.text.toLowerCase()).toMatch(/^#[c-f]/);

      // Focus color is bright enough to stand out
      expect(LunariaColors.focus).toMatch(/^#[6-9A-F]/);
    });
  });

  describe('Color Consistency', () => {
    it('should have matching colors between themes', () => {
      // The focus/accent color should be consistent
      expect(Colors.dark.focus).toBe(LunariaColors.focus);
      expect(Colors.dark.tint).toBe(LunariaColors.focus);

      // Background colors should match
      expect(Colors.dark.background).toBe(LunariaColors.bg);

      // Text colors should match
      expect(Colors.dark.text).toBe(LunariaColors.text);
    });

    it('should maintain theme hierarchy', () => {
      // Card background should be lighter than main background
      const bgValue = parseInt(LunariaColors.bg.slice(1), 16);
      const cardValue = parseInt(LunariaColors.card.slice(1), 16);

      expect(cardValue).toBeGreaterThan(bgValue);

      // Border should be lighter than card background
      const borderValue = parseInt(LunariaColors.border.slice(1), 16);
      expect(borderValue).toBeGreaterThan(cardValue);
    });
  });
});