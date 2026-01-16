import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';
import { Alert } from 'react-native';

// Screens importieren
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TestScreen from './src/screens/TestScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userText, setUserText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const API_URL = BACKEND_URL;

  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('@is_logged_in');
        const savedEmail = await AsyncStorage.getItem('@user_email');
        const savedText = await AsyncStorage.getItem('@user_text');

        if (loggedIn === 'true' && savedEmail) {
          setUserEmail(savedEmail);
          setUserText(savedText || '');
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Fehler beim Laden des lokalen Speichers:", e);
      } finally {
        setIsAppReady(true);
      }
    };
    loadInitialState();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/status`);
      const json = await response.json();
      setData(json.nachricht);
    } catch (e) {
      setData("Verbindungsfehler: Backend nicht erreichbar");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
        await AsyncStorage.setItem('@is_logged_in', 'true');
        await AsyncStorage.setItem('@user_email', email);
        await AsyncStorage.setItem('@user_text', json.user.userData || '');

        setUserEmail(email);
        setUserText(json.user.userData || '');
        setIsLoggedIn(true);
      } else {
        setLoginError(json.fehler || "Login fehlgeschlagen");
      }
    } catch (e) {
      setLoginError("Netzwerkfehler: Bitte Internetverbindung prüfen");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/save-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, userData: userText }),
      });

      await AsyncStorage.multiRemove(['@is_logged_in', '@user_email', '@user_text']);

      setUserEmail('');
      setUserText('');
      setData(null);
      setIsLoggedIn(false);
    } catch (e) {
      console.error("Fehler beim Logout/Sync:", e);
      Alert.alert("Hinweis", "Fehler beim Speichern. Du wirst trotzdem ausgeloggt.");
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ wird vom TestScreen mit Passwort aufgerufen: onDeleteAccount(deletePassword)
  const handleDeleteAccount = async (password) => {
    if (!password || !password.trim()) {
      Alert.alert("Passwort fehlt", "Bitte Passwort eingeben.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/delete-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        Alert.alert("Fehler", json.fehler || "Fehler beim Löschen.");
        throw new Error(json.fehler || "Delete failed");
      }

      await AsyncStorage.multiRemove(['@is_logged_in', '@user_email', '@user_text']);
      setUserEmail('');
      setUserText('');
      setData(null);
      setIsLoggedIn(false);

      Alert.alert("Erfolg", "Konto wurde gelöscht.");
    } catch (e) {
      console.error(e);
      // TestScreen lässt Modal offen bei Fehler -> ok
      if (!String(e?.message || "").includes("Delete failed")) {
        Alert.alert("Fehler", "Netzwerkfehler beim Löschen.");
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  if (!isAppReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Dashboard">
            {(props) => (
              <TestScreen
                {...props}
                userText={userText}
                setUserText={setUserText}
                onLogout={handleLogout}
                onTest={testConnection}
                onDeleteAccount={handleDeleteAccount}   // ✅ wichtig
                data={data}
                loading={loading}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLogin={handleLogin}
                  errorMessage={loginError}
                  loading={loading}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
