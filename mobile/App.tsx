import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Scan } from './src/types/scan';
import { randomUUID } from 'expo-crypto';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [manualValue, setManualValue] = useState("");

  function handleAddScan() {
    if (manualValue.trim() === "") {
      return;
    }
    
    const newScan: Scan = {
      id: randomUUID(),
      value: manualValue,
      format: "unknown",
      scannedAt: new Date().toISOString(),
    };

    setScans((currentScans) => [...currentScans, newScan]);
    setManualValue("");
  }

  async function handleCopyValues() {
    if (scans.length === 0) {
      return;
    }

    const values = scans.map((scan) => scan.value).join('\n');
    await Clipboard.setStringAsync(values);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Scanner</Text>
      <Text>{scans.length}</Text>
      <TextInput
        value={manualValue}
        onChangeText={setManualValue}
        placeholder='Enter Barcode Manually'
        autoCapitalize='none'
        autoCorrect={false}
        accessibilityLabel='Barcode Value'
        style={styles.input}
      />
      <Button title='Add Scan' onPress={handleAddScan} />
      {scans.map((scan) => (
        <Text key={scan.id}>{scan.value}</Text>
      ))}

      <Button title='Copy to Clipboard' onPress={handleCopyValues} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b7feff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    width: "80%",
    marginTop: 16,
  }
});
