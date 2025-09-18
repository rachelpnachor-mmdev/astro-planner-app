// Import File class from expo-file-system
// Use fetch and FileSystem for writing files
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { LunariaColors } from '../constants/Colors';

export default function PDFExport() {
  // Remote PDF URL for preview and sharing
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // Replace with your actual PDF URL

  const handleDownload = async () => {
    try {
      // Open the PDF in the browser
      await WebBrowser.openBrowserAsync(pdfUrl);
    } catch (error) {
      Alert.alert('Open Failed', String(error));
    }
  };
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PDF Export</Text>
      <Text style={styles.subtitle}>Preview your planner PDF below:</Text>
      <View style={styles.pdfContainer}>
        <WebView
          source={{ uri: pdfUrl }}
          style={styles.pdf}
          originWhitelist={["*"]}
          useWebKit
        />
      </View>
      <Button title="Download PDF" onPress={handleDownload} />
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
    backgroundColor: LunariaColors.bg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: LunariaColors.text,
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 16,
    minHeight: 400,
    maxHeight: 600,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: 400,
  },
  note: {
    fontSize: 14,
    color: LunariaColors.sub,
    marginTop: 24,
    textAlign: 'center',
  },
});