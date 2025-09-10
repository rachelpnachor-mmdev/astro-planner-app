import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

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
};

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  defaultKey,
  valueKey,
  onChange,
}) => {
  if (!options || options.length < 2) {
    console.warn('SegmentControl: options must have at least 2 items');
    return null;
  }

  // Uncontrolled mode: use internal state
  const initialKey =
    defaultKey && options.some((o) => o.key === defaultKey)
      ? defaultKey
      : options[0].key;
  const [uncontrolledKey, setUncontrolledKey] = useState(initialKey);

  // Controlled mode: use valueKey from props
  const isControlled = valueKey !== undefined;
  const selectedKey = isControlled ? valueKey : uncontrolledKey;

  const handlePress = (key: string) => {
    if (isControlled) {
      onChange?.(key);
    } else {
      setUncontrolledKey(key);
      onChange?.(key);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.key === selectedKey;
        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.button, selected && styles.selectedButton, option.disabled && styles.disabledButton]}
            onPress={() => !option.disabled && !option.loading && handlePress(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled: !!option.disabled, busy: !!option.loading }}
            disabled={!!option.disabled || !!option.loading}
          >
            {option.loading ? (
              <View style={styles.spinner} accessibilityLabel="Loading segment">
                <ActivityIndicator size="small" color="#888" />
              </View>
            ) : (
              <Text style={[styles.label, selected && styles.selectedLabel, option.disabled && styles.disabledLabel]}>
                {option.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: '#eee',
    padding: 4,
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: '#ccc',
  },
  disabledButton: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  selectedLabel: {
    fontWeight: 'bold',
    color: '#111',
  },
  disabledLabel: {
    color: '#888',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
});