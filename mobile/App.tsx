import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Scan } from './src/types/scan';
import { randomUUID } from 'expo-crypto';
import * as Clipboard from 'expo-clipboard';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { getScans, initializeDatabase, insertScan } from './src/database/scans';

function ScanScreen() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [manualValue, setManualValue] = useState("");

  const db = useSQLiteContext();

  useEffect(() => {
    let active = true;

    async function loadSavedScans() {
      try {
        const savedScans = await getScans(db);
        if (active) {
          setScans(savedScans);
        }
      } catch (error) {
        console.error('Could not load scans:', error);
      }
    }

    void loadSavedScans();

    return () => {
      active = false;
    };
  }, [db]);

  async function handleAddScan() {
    if (manualValue.trim() === "") {
      return;
    }
    
    const newScan: Scan = {
      id: randomUUID(),
      value: manualValue,
      format: "unknown",
      scannedAt: new Date().toISOString(),
    };

    await insertScan(db, newScan);
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

export default function App() {
  return (
    <SQLiteProvider databaseName="scans.db" onInit={initializeDatabase}>
      <ScanScreen />
    </SQLiteProvider>
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
