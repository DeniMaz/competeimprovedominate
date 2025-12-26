import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

/**
 * Startbildschirm der App mit Logo und Navigations-Button zum Login.
 * Home screen of the app featuring the logo and navigation button to login.
 */
export default function HomeScreen({ onNavigateToLogin }) {
  return (
    <View style={styles.container}>
      {/* App Logo - Quelle: assets/logo.jpg | App logo - source: assets/logo.jpg */}
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.logo} 
      />
      
      {/* Willkommenstext | Welcome text */}
      <Text style={styles.welcomeText}>Willkommen bei Territory Conqueror</Text>
      
      {/* Navigations-Button zum Login-Screen | Navigation button to login screen */}
      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={onNavigateToLogin}
      >
        <Text style={styles.buttonText}>Zum Login</Text>
      </TouchableOpacity>
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
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333'
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});