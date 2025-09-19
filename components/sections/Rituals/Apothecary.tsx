import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HoroscopeColors } from '../../../constants/Colors';

const INITIAL_INVENTORY = {
  Candles: [
    { name: "White", quantity: 3, notes: "For cleansing rituals" },
    { name: "Black", quantity: 2, notes: "Protection work" },
    { name: "Green", quantity: 1, notes: "Prosperity spells" }
  ],
  Crystals: [
    { name: "Amethyst", quantity: 1, notes: "Tower shape" },
    { name: "Rose Quartz", quantity: 1, notes: "Heart shape" },
    { name: "Citrine", quantity: 1, notes: "Point shape" }
  ],
  Oils: [
    { name: "Lavender", quantity: 1, notes: "For relaxation" },
    { name: "Rose", quantity: 1, notes: "Love workings" },
    { name: "Earth Oil", quantity: 1, notes: "Grounding blend" }
  ],
  Herbs: [
    { name: "Sage", quantity: 1, notes: "White sage bundle" },
    { name: "Rosemary", quantity: 1, notes: "Dried sprigs" },
    { name: "Thyme", quantity: 1, notes: "Ground form" }
  ],
  Incense: [
    { name: "Frankincense", quantity: 5, notes: "Stick form" },
    { name: "Rose", quantity: 3, notes: "Cone form" },
    { name: "Sandalwood", quantity: 1, notes: "Powder form" }
  ],
  Tools: [
    { name: "Athame", quantity: 1, notes: "Black handle" },
    { name: "Chalice", quantity: 1, notes: "Silver plated" },
    { name: "Pentacle", quantity: 1, notes: "Wood carved" }
  ]
};

const CATEGORY_TABS = Object.keys(INITIAL_INVENTORY);

export default function Apothecary({ locked = false }: { locked?: boolean }) {
  const [activeTab, setActiveTab] = useState('Candles');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const addItem = () => {
    if (!newItem.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const quantity = parseInt(newItem.quantity) || 1;
    const item = {
      name: newItem.name.trim(),
      quantity,
      notes: newItem.notes.trim()
    };

    setInventory(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], item].sort((a, b) => a.name.localeCompare(b.name))
    }));

    setNewItem({ name: '', quantity: '', notes: '' });
    setShowAddForm(false);
  };

  const removeItem = (index: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setInventory(prev => ({
              ...prev,
              [activeTab]: prev[activeTab].filter((_, i) => i !== index)
            }));
          }
        }
      ]
    );
  };

  const filteredItems = inventory[activeTab].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Apothecary (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Apothecary</Text>
      <Text style={styles.subtitle}>Your magical supplies inventory</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color={HoroscopeColors.text3} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor={HoroscopeColors.text3}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {CATEGORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddForm(!showAddForm)}
      >
        <Feather name="plus" size={16} color={HoroscopeColors.bg} />
        <Text style={styles.addButtonText}>Add {activeTab.slice(0, -1)}</Text>
      </TouchableOpacity>

      {/* Add Item Form */}
      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Item name"
            placeholderTextColor={HoroscopeColors.text3}
            value={newItem.name}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            placeholderTextColor={HoroscopeColors.text3}
            value={newItem.quantity}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, quantity: text }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Notes (optional)"
            placeholderTextColor={HoroscopeColors.text3}
            value={newItem.notes}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, notes: text }))}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={addItem}>
              <Text style={styles.saveButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Items List */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemActions}>
                <Text style={styles.itemQuantity}>({item.quantity})</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(index)}
                >
                  <Feather name="trash-2" size={16} color={HoroscopeColors.text3} />
                </TouchableOpacity>
              </View>
            </View>
            {item.notes ? (
              <Text style={styles.itemNotes}>{item.notes}</Text>
            ) : null}
          </View>
        ))}
        {filteredItems.length === 0 && (
          <Text style={styles.emptyText}>
            {searchQuery ? 'No items match your search' : `No ${activeTab.toLowerCase()} in inventory`}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: HoroscopeColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: HoroscopeColors.text2,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HoroscopeColors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: HoroscopeColors.text,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: HoroscopeColors.surface,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  activeTab: {
    backgroundColor: HoroscopeColors.accent,
    borderColor: HoroscopeColors.accent,
  },
  tabText: {
    fontSize: 14,
    color: HoroscopeColors.text2,
    fontWeight: '500',
  },
  activeTabText: {
    color: HoroscopeColors.bg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HoroscopeColors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: HoroscopeColors.bg,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  input: {
    backgroundColor: HoroscopeColors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: HoroscopeColors.text,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: HoroscopeColors.text3,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: HoroscopeColors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonText: {
    color: HoroscopeColors.bg,
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: HoroscopeColors.text,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: HoroscopeColors.accent,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  itemNotes: {
    fontSize: 14,
    color: HoroscopeColors.text2,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: HoroscopeColors.text3,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HoroscopeColors.cardSubtle,
    borderRadius: 12,
    padding: 32,
    marginVertical: 20,
  },
  lockedText: {
    fontSize: 16,
    color: HoroscopeColors.text3,
    textAlign: 'center',
  },
});