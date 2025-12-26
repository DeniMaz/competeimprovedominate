import React, { useState } from 'react';
import { BACKEND_URL } from '@env';

// Import der ausgelagerten Screens | Import of externalized screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import TestScreen from './src/screens/TestScreen';

/**
 * Hauptkomponente zur Steuerung des App-Flows und des globalen Status.
 * Main component controlling the app flow and global state.
 */
export default function App() {
  // Navigationsstatus: 'HOME', 'LOGIN', 'TEST' | Navigation state: 'HOME', 'LOGIN', 'TEST'
  const [currentScreen, setCurrentScreen] = useState('HOME');
  
  // Status für Backend-Testdaten und Ladezustand | State for backend test data and loading status
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // API-Endpunkt aus Umgebungsvariablen | API endpoint from environment variables
  const API_URL = BACKEND_URL;

  /**
   * Führt eine Test-Anfrage an das konfigurierte Backend aus.
   * Performs a test request to the configured backend.
   */
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

  /**
   * Bedingtes Rendering basierend auf dem Navigations-Status (Switch-Logik).
   * Conditional rendering based on navigation state (switch logic).
   */
  switch (currentScreen) {
    case 'HOME':
      return <HomeScreen onNavigateToLogin={() => setCurrentScreen('LOGIN')} />;
    case 'LOGIN':
      return (
        <LoginScreen 
          onLoginSuccess={() => setCurrentScreen('TEST')} 
          onBack={() => setCurrentScreen('HOME')} 
        />
      );
    case 'TEST':
      return (
        <TestScreen 
          data={data} 
          loading={loading} 
          onTest={testConnection} 
          onLogout={() => setCurrentScreen('HOME')} 
        />
      );
    default:
      return <HomeScreen onNavigateToLogin={() => setCurrentScreen('LOGIN')} />;
  }
}