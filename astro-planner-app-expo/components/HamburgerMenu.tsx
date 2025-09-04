import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function HamburgerMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={styles.menu}
          accessibilityRole="menu"
          accessibilityLabel="Main menu"
        >
          <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Menu">Menu</Text>
          <TouchableOpacity style={styles.item} accessibilityRole="menuitem" accessibilityLabel="Profile">
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} accessibilityRole="menuitem" accessibilityLabel="Your Package">
            <Text style={styles.itemText}>Your Package</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} accessibilityRole="menuitem" accessibilityLabel="Upgrade">
            <Text style={styles.itemText}>Upgrade</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <Feather name="x" size={24} color="#222" accessibilityLabel="Close icon" accessibilityRole="image" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 24,
    paddingTop: 40,
    minHeight: 220,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
