import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import type { Scan } from './src/types/scan';
import { randomUUID } from 'expo-crypto';

export default function App() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [manualValue, setManualValue] = useState("")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Scanner</Text>
      <Text style={styles.title}>Scans: {scans.length}</Text>
      <TextInput
        value={manualValue}
        onChangeText={setManualValue}
        placeholder='Enter Barcode Value'
        autoCapitalize='none'
        autoCorrect={false}
        accessibilityLabel='Barcode value'
        style={styles.input}
      />

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700'
  },

  input: {
    borderWidth: 1,
    padding: 12,
    width: "80%",
    marginTop: 16
  }
});
