import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';

/**
 * Simulierter Login-Bildschirm zur Vorbereitung der User-Authentifizierung.
 * Simulated login screen for upcoming user authentication implementation.
 */
export default function LoginScreen({ onLoginSuccess, onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Bereich</Text>
      <Text style={styles.infoText}>
        Hier kannst du dich später mit deinem Account anmelden.
        You will be able to log in with your account here later.
      </Text>
      
      {/* Button zur Simulation eines erfolgreichen Logins | Button to simulate successful login */}
      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={onLoginSuccess}
      >
        <Text style={styles.buttonText}>Einloggen (Simuliert)</Text>
      </TouchableOpacity>

      {/* Rücknavigation zum HomeScreen | Navigation back to HomeScreen */}
      <Button title="Zurück" onPress={onBack} color="gray" />
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666'
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});