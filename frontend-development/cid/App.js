import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { BACKEND_URL } from '@env'

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = BACKEND_URL

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setData(json.nachricht);
    } catch (error) {
      setData("Fehler: Backend nicht erreichbar");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Durchstich Test</Text>
      
      <Button title="Backend anfunken" onPress={testConnection} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {data && (
        <View style={styles.resultBox}>
          <Text>Antwort vom Server:</Text>
          <Text style={styles.resultText}>{data}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
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