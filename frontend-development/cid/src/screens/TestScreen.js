import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';

/**
 * Bildschirm zur Überprüfung der Backend-Konnektivität (Durchstichtest).
 * Screen to verify backend connectivity (connection test).
 */
export default function TestScreen({ data, loading, onTest, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Durchstich Test</Text>
      
      {/* Ausführung des API-Tests | Execution of the API test */}
      <Button title="Backend anfunken" onPress={onTest} />

      {/* Ladeanzeige während des Fetch-Vorgangs | Loading indicator during fetch process */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      
      {/* Anzeige der Backend-Antwort | Display of backend response */}
      {data && (
        <View style={styles.resultBox}>
          <Text>Antwort vom Server:</Text>
          <Text style={styles.resultText}>{data}</Text>
        </View>
      )}

      {/* Logout-Button zur Rückkehr zum Start | Logout button to return to start */}
      <View style={{ marginTop: 50 }}>
        <Button title="Logout" onPress={onLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  resultBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  resultText: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold'
  }
});