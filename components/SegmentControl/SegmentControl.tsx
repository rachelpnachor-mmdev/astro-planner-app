import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ActivityIndicator, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LunariaColors } from '../../constants/Colors';

export type SegmentOption = {
  key: string;
  label: string;
  disabled?: boolean;
  loading?: boolean;
};

export type SegmentControlProps = {
  options: SegmentOption[];
  defaultKey?: string;
  valueKey?: string;
  onChange?: (key: string) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: {
    background?: string;
    selectedBackground?: string;
    border?: string;
    text?: string;
    selectedText?: string;
    thumb?: string;
  };
  persistenceKey?: string;
  testID?: string;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // will be overridden for RTL
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: LunariaColors.border,
    padding: 4,
  },
  button: {
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    borderRadius: 999,
  },
  selectedLabel: {
    fontWeight: 'bold' as const,
  },
  disabledButton: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    color: LunariaColors.text,
  },
  disabledLabel: {
    color: LunariaColors.sub,
  },
  spinner: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minWidth: 24,
  },
});

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  defaultKey,
  valueKey,
  onChange,
  size = 'md',
  theme = {},
  persistenceKey,
  testID,
}) => {
  // Uncontrolled mode: use internal state
  const initialKey =
    defaultKey && options && options.some((o) => o.key === defaultKey)
      ? defaultKey
      : options && options.length > 0
        ? options[0].key
        : undefined;
  const [uncontrolledKey, setUncontrolledKey] = useState(initialKey);

  // Load persisted value on mount
  React.useEffect(() => {
    if (persistenceKey) {
      AsyncStorage.getItem(persistenceKey).then((stored) => {
        if (stored && options.some((o) => o.key === stored)) {
          setUncontrolledKey(stored);
        }
      });
    }
  }, [persistenceKey, options]);

  if (!options || options.length < 2) {
    console.warn('SegmentControl: options must have at least 2 items');
    return null;
  }

  // Error handling for invalid valueKey
  const isControlled = valueKey !== undefined;
  let selectedKey;
  if (isControlled) {
    if (valueKey && !options.some(o => o.key === valueKey)) {
      console.warn(`SegmentControl: valueKey '${valueKey}' not found in options. Falling back to first option.`);
      selectedKey = options[0].key;
    } else {
      selectedKey = valueKey;
    }
  } else {
    selectedKey = uncontrolledKey;
  }

  const handlePress = (key: string) => {
    if (isControlled) {
      onChange?.(key);
    } else {
      setUncontrolledKey(key);
      onChange?.(key);
      if (persistenceKey) {
        AsyncStorage.setItem(persistenceKey, key);
      }
    }
  };

  // Sizing tokens
  const sizeTokens = {
  sm: { height: 32, fontSize: 14, paddingH: 10, paddingV: 4 },
  md: { height: 40, fontSize: 16, paddingH: 16, paddingV: 8 },
  lg: { height: 52, fontSize: 20, paddingH: 24, paddingV: 12 },
  };
  const t = sizeTokens[size] || sizeTokens.md;

  // Theme tokens
  const bg = theme.background || '#eee';
  const selBg = theme.selectedBackground || '#ccc';
  const border = theme.border || 'transparent';
  const text = theme.text || '#333';
  const selText = theme.selectedText || '#111';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderRadius: 999, borderColor: border, borderWidth: 1, minHeight: t.height },
        I18nManager.isRTL ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }
      ]}
      accessibilityRole="tablist"
      accessibilityLabel="Segmented control options"
      testID={testID || 'SegmentControl'}
    >
      {options.map((option) => {
        const selected = option.key === selectedKey;
        return (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.button,
              selected && { backgroundColor: selBg },
              option.disabled && styles.disabledButton,
              { borderRadius: 999, paddingHorizontal: t.paddingH, paddingVertical: t.paddingV, minHeight: t.height }
            ]}
            onPress={() => !option.disabled && !option.loading && handlePress(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: !!option.disabled, busy: !!option.loading }}
            accessibilityLabel={option.label + (option.disabled ? ' (disabled)' : option.loading ? ' (loading)' : selected ? ' (selected)' : '')}
            disabled={!!option.disabled || !!option.loading}
            testID={`${testID || 'SegmentControl'}-item-${option.key}`}
          >
            {option.loading ? (
              <View style={styles.spinner} accessibilityLabel="Loading segment">
                <ActivityIndicator size="small" color="#888" />
              </View>
            ) : (
              <Text
                style={[
                  styles.label,
                  { fontSize: t.fontSize, color: selected ? selText : text, textAlign: I18nManager.isRTL ? 'right' : 'left' },
                  selected && styles.selectedLabel,
                  option.disabled && styles.disabledLabel
                ]}
                allowFontScaling={true}
              >
                {option.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

