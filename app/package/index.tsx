import React from 'react';
import { ScrollView, StyleSheet, Text, View, Switch, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LunariaColors } from '../../constants/Colors';
import { useEntitlement } from '../../context/EntitlementContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LunariaColors.bg,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LunariaColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: LunariaColors.sub,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: LunariaColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: LunariaColors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: LunariaColors.text,
    marginBottom: 12,
  },
  entitlementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: LunariaColors.border,
  },
  entitlementRowLast: {
    borderBottomWidth: 0,
  },
  entitlementLabel: {
    fontSize: 16,
    color: LunariaColors.text,
    flex: 1,
  },
  entitlementDescription: {
    fontSize: 14,
    color: LunariaColors.sub,
    marginTop: 2,
  },
  entitlementInfo: {
    flex: 1,
  },
  devNote: {
    backgroundColor: LunariaColors.focus,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  devNoteText: {
    fontSize: 14,
    color: LunariaColors.white,
    fontWeight: '500',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: LunariaColors.focus,
    borderRadius: 20,
  },
  doneButtonText: {
    color: LunariaColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function PackageScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { entitlement, setEntitlement } = useEntitlement();

  const handleGoBack = () => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        router.back();
      }
    } catch (error) {
      // Fallback to router
      router.back();
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: 'Your Package',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleGoBack}
          style={{ marginRight: 16 }}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Feather name="x" size={24} color={LunariaColors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const toggleEntitlement = (key: keyof typeof entitlement, subKey?: string) => {
    if (subKey && typeof entitlement[key] === 'object') {
      setEntitlement({
        ...entitlement,
        [key]: {
          ...(entitlement[key] as any),
          [subKey]: !(entitlement[key] as any)[subKey],
        },
      });
    } else {
      setEntitlement({
        ...entitlement,
        [key]: !entitlement[key],
      });
    }
  };

  const resetAll = () => {
    Alert.alert(
      'Reset All Entitlements',
      'This will reset all entitlements to locked. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setEntitlement({
              horoscope: false,
              rituals: false,
              kitchenHome: {
                chores: false,
                meals: false,
                mixedUnlock: false,
              },
              goals: false,
              reflections: false,
            });
          },
        },
      ]
    );
  };

  const unlockAll = () => {
    setEntitlement({
      horoscope: true,
      rituals: true,
      kitchenHome: {
        chores: true,
        meals: true,
        mixedUnlock: true,
      },
      goals: true,
      reflections: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.header}>Your Package</Text>
            <Text style={styles.subtitle}>Manage your app entitlements</Text>
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleGoBack}
            accessibilityLabel="Done"
            accessibilityRole="button"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.devNote}>
          <Text style={styles.devNoteText}>
            🛠️ Dev Tools: Toggle features for testing without payment integration
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Features</Text>

          <View style={styles.entitlementRow}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Horoscope</Text>
              <Text style={styles.entitlementDescription}>
                Daily, weekly, monthly horoscope readings
              </Text>
            </View>
            <Switch
              value={entitlement.horoscope}
              onValueChange={() => toggleEntitlement('horoscope')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.horoscope ? LunariaColors.white : LunariaColors.sub}
            />
          </View>

          <View style={styles.entitlementRow}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Rituals (Witch Package)</Text>
              <Text style={styles.entitlementDescription}>
                Spiritual rituals and ceremonies
              </Text>
            </View>
            <Switch
              value={entitlement.rituals}
              onValueChange={() => toggleEntitlement('rituals')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.rituals ? LunariaColors.white : LunariaColors.sub}
            />
          </View>

          <View style={styles.entitlementRow}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Goals</Text>
              <Text style={styles.entitlementDescription}>
                Goal setting and tracking
              </Text>
            </View>
            <Switch
              value={entitlement.goals}
              onValueChange={() => toggleEntitlement('goals')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.goals ? LunariaColors.white : LunariaColors.sub}
            />
          </View>

          <View style={[styles.entitlementRow, styles.entitlementRowLast]}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Reflections</Text>
              <Text style={styles.entitlementDescription}>
                Daily reflections and journaling
              </Text>
            </View>
            <Switch
              value={entitlement.reflections}
              onValueChange={() => toggleEntitlement('reflections')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.reflections ? LunariaColors.white : LunariaColors.sub}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kitchen & Home Features</Text>

          <View style={styles.entitlementRow}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Chores</Text>
              <Text style={styles.entitlementDescription}>
                Household chore management
              </Text>
            </View>
            <Switch
              value={entitlement.kitchenHome.chores}
              onValueChange={() => toggleEntitlement('kitchenHome', 'chores')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.kitchenHome.chores ? LunariaColors.white : LunariaColors.sub}
            />
          </View>

          <View style={styles.entitlementRow}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Meals</Text>
              <Text style={styles.entitlementDescription}>
                Meal planning and recipes
              </Text>
            </View>
            <Switch
              value={entitlement.kitchenHome.meals}
              onValueChange={() => toggleEntitlement('kitchenHome', 'meals')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.kitchenHome.meals ? LunariaColors.white : LunariaColors.sub}
            />
          </View>

          <View style={[styles.entitlementRow, styles.entitlementRowLast]}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Mixed Unlock</Text>
              <Text style={styles.entitlementDescription}>
                Special mixed features unlock
              </Text>
            </View>
            <Switch
              value={entitlement.kitchenHome.mixedUnlock}
              onValueChange={() => toggleEntitlement('kitchenHome', 'mixedUnlock')}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={entitlement.kitchenHome.mixedUnlock ? LunariaColors.white : LunariaColors.sub}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.entitlementRow}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Unlock All Features</Text>
              <Text style={styles.entitlementDescription}>
                Enable all app features for testing
              </Text>
            </View>
            <Switch
              value={false}
              onValueChange={unlockAll}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={LunariaColors.sub}
            />
          </View>

          <View style={[styles.entitlementRow, styles.entitlementRowLast]}>
            <View style={styles.entitlementInfo}>
              <Text style={styles.entitlementLabel}>Reset All Features</Text>
              <Text style={styles.entitlementDescription}>
                Lock all features to test locked states
              </Text>
            </View>
            <Switch
              value={false}
              onValueChange={resetAll}
              trackColor={{ false: LunariaColors.border, true: LunariaColors.focus }}
              thumbColor={LunariaColors.sub}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}