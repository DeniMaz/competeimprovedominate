import React, { useState } from 'react';
import { BACKEND_URL } from '@env';

/** * Import der funktionalen Bildschirme | Import of functional screens 
 */
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TestScreen from './src/screens/TestScreen';

/**
 * Hauptkomponente zur Steuerung des Anwendungsflusses.
 * Main component for controlling the application flow.
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  /** * Status für spezifische Fehlermeldungen im Login-Prozess.
   * State for specific error messages during the login process.
   */
  const [loginError, setLoginError] = useState(null);

  const API_URL = BACKEND_URL;

  /**
   * Führt einen Verbindungstest zum Backend durch (GET /status).
   * Performs a connectivity test to the backend (GET /status).
   */
  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/status`);
      const json = await response.json();
      setData(json.nachricht);
    } catch (error) {
      setData("Fehler: Backend nicht erreichbar | Error: Backend unreachable");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Übermittelt Registrierungsdaten an das Backend (POST /register).
   * Submits registration data to the backend (POST /register).
   */
  const handleRegister = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();

      if (response.ok) {
        setData(json.nachricht);
        setCurrentScreen('TEST');
      } else {
        setData(json.fehler || "Registrierung fehlgeschlagen");
        setCurrentScreen('TEST');
      }
    } catch (error) {
      setData("Netzwerkfehler | Network error");
      setCurrentScreen('TEST');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Authentifiziert den Benutzer und verwaltet Fehler lokal im LoginScreen.
   * Authenticates the user and manages errors locally within the LoginScreen.
   */
  const handleLogin = async (email, password) => {
    setLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (response.ok) {
        /** * Navigation nur bei erfolgreicher Authentifizierung.
         * Navigation only upon successful authentication.
         */
        setData(`Erfolgreich angemeldet: ${json.user.email}`);
        setCurrentScreen('TEST');
      } else {
        /** * Fehler wird lokal gespeichert und im LoginScreen angezeigt.
         * Error is stored locally and displayed in the LoginScreen.
         */
        setLoginError(json.fehler || "Login fehlgeschlagen");
      }
    } catch (error) {
      setLoginError("Netzwerkfehler: Backend nicht erreichbar");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Zentrales Navigations-Management.
   * Central navigation management.
   */
  switch (currentScreen) {
    case 'HOME':
      return (
        <HomeScreen 
          onNavigateToLogin={() => {
            setLoginError(null);
            setCurrentScreen('LOGIN');
          }} 
          onNavigateToRegister={() => setCurrentScreen('REGISTER')} 
        />
      );
    case 'LOGIN':
      return (
        <LoginScreen 
          onLogin={handleLogin} 
          errorMessage={loginError}
          onBack={() => setCurrentScreen('HOME')} 
        />
      );
    case 'REGISTER':
      return (
        <RegisterScreen 
          onRegister={handleRegister} 
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