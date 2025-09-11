import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function PDFExport() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PDF Export</Text>
      <Text style={styles.subtitle}>Export your planner as a PDF (coming soon)</Text>
      <Button title="Export to PDF" disabled onPress={() => {}} />
      <Text style={styles.note}>
        This feature will generate a US Letter size, grayscale PDF using system sans-serif fonts and a minimal, elegant layout.
      </Text>
      <Button title="Cancel" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#555',
  },
  note: {
    fontSize: 14,
    color: '#888',
    marginTop: 24,
    textAlign: 'center',
  },
});