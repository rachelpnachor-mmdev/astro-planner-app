import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { HoroscopeColors } from '../../../constants/Colors';

const SAMPLE_NOTES = [
  {
    date: "Today",
    ritual: "Moon in Virgo Ritual",
    note: "I swapped rosemary for sage today — worked beautifully."
  },
  {
    date: "Yesterday",
    ritual: "Daily Grounding",
    note: "Felt extra grounded after this ritual."
  }
];

export default function NotesAdaptations({ locked = false }: { locked?: boolean }) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(SAMPLE_NOTES);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        date: "Today",
        ritual: "Moon in Virgo Ritual",
        note: newNote.trim()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>🔒 Notes/Adaptations (locked)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Notes & Adaptations</Text>
        <Text style={styles.subtitle}>Your Book of Shadows journal</Text>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Add a new note:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Share your ritual insights, adaptations, or observations..."
            placeholderTextColor={HoroscopeColors.text3}
            value={newNote}
            onChangeText={setNewNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.saveButton, !newNote.trim() && styles.saveButtonDisabled]}
            onPress={addNote}
            disabled={!newNote.trim()}
          >
            <Text style={[styles.saveButtonText, !newNote.trim() && styles.saveButtonTextDisabled]}>
              Save Note
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesHeader}>Previous Notes</Text>
          {notes.map((note, index) => (
            <View key={index} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteDate}>{note.date}</Text>
                <Text style={styles.noteRitual}>{note.ritual}</Text>
              </View>
              <Text style={styles.noteText}>{note.note}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
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
  inputCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: HoroscopeColors.text,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: HoroscopeColors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: HoroscopeColors.text,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
    minHeight: 100,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: HoroscopeColors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
  },
  saveButtonDisabled: {
    backgroundColor: HoroscopeColors.text3,
    opacity: 0.5,
  },
  saveButtonText: {
    color: HoroscopeColors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: HoroscopeColors.text3,
  },
  notesSection: {
    marginTop: 8,
  },
  notesHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: HoroscopeColors.text,
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: HoroscopeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: HoroscopeColors.line,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 14,
    color: HoroscopeColors.accent,
    fontWeight: '500',
  },
  noteRitual: {
    fontSize: 12,
    color: HoroscopeColors.text3,
    fontStyle: 'italic',
  },
  noteText: {
    fontSize: 15,
    color: HoroscopeColors.text2,
    lineHeight: 22,
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
