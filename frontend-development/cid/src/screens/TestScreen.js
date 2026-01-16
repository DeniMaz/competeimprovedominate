<<<<<<< HEAD
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
  Alert
} from 'react-native';

export default function TestScreen({
  data,
  loading,
  onTest,
  onLogout,
  onDeleteAccount, // erwartet jetzt: onDeleteAccount(password)
  userText,
  setUserText
}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const openDeleteModal = () => {
    setDeletePassword('');
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setDeletePassword('');
  };

  const confirmDelete = () => {
    if (!deletePassword.trim()) {
      Alert.alert("Passwort fehlt", "Bitte gib dein Passwort ein, um das Konto zu löschen.");
      return;
    }

    // optional: Extra Warnung
    Alert.alert(
      "Wirklich löschen?",
      "Dieser Schritt ist endgültig. Dein Account wird gelöscht.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await onDeleteAccount(deletePassword);
              closeDeleteModal();
            } catch (e) {
              // falls deine onDeleteAccount wirft
              // Modal offen lassen, damit man es nochmal versuchen kann
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
=======
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function TestScreen({ data, loading, onTest, onLogout, userText, setUserText }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    let locationSubscription = null;

    (async () => {
      console.log("Prüfe Standort-Berechtigungen...");
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Berechtigung zum Zugriff auf den Standort wurde verweigert.');
          return;
        }

        // 1. Versuch: Schneller Abruf des letzten bekannten Standorts (verhindert Hanging)
        let lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          console.log("Letzter bekannter Standort geladen.");
          updateLocationState(lastKnown);
        }

        // 2. Versuch: Aktuellen Standort mit Timeout abrufen
        // Wir setzen ein kurzes Zeitlimit, damit die App nicht hängen bleibt
        try {
          let initialLocation = await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);
          console.log("Aktueller initialer Standort gefunden.");
          updateLocationState(initialLocation);
        } catch (e) {
          console.log("Initialer Abruf übersprungen (Timeout/Fehler), starte Live-Tracking...");
        }

        // 3. Kontinuierliches Tracking starten
        // Das ist am wichtigsten für den Emulator, da er auf "Set Location" Events reagiert
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // Wir reagieren schon auf 1 Meter Änderung für Tests
            timeInterval: 2000,   // Alle 2 Sekunden prüfen
          },
          (newLocation) => {
            console.log("Live-Standort Update erhalten.");
            updateLocationState(newLocation);
          }
        );

      } catch (err) {
        console.error("Fehler im Location-Setup:", err);
        setErrorMsg("GPS-Fehler: " + err.message);
      }
    })();

    // Cleanup-Funktion beim Verlassen des Screens
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        console.log("Location-Subscription beendet.");
      }
    };
  }, []);

  const updateLocationState = (newLocation) => {
    const { latitude, longitude } = newLocation.coords;
    setLocation(newLocation.coords);
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  return (
    <KeyboardAvoidingView 
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Dashboard</Text>
<<<<<<< HEAD

        {/* Anzeige der System-Nachrichten */}
=======
        
        <View style={styles.mapContainer}>
          {region ? (
            <MapView 
              style={styles.map} 
              region={region}
              showsUserLocation={true}
              loadingEnabled={true}
            >
              {location && (
                <Marker 
                  coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                  title="Aktuelle Position"
                />
              )}
            </MapView>
          ) : (
            <View style={[styles.map, styles.mapPlaceholder]}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ marginTop: 10 }}>Warte auf GPS-Daten...</Text>
              {errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
              <Text style={styles.hintText}>
                Tipp: Setze im Emulator erst die Location, dann starte die App mit 'r' neu.
              </Text>
            </View>
          )}
        </View>

>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
        <View style={styles.messageBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
<<<<<<< HEAD
            <Text style={styles.messageText}>
              {data || "Bereit für Verbindungstest..."}
            </Text>
=======
            <Text style={styles.messageText}>{data || "System bereit"}</Text>
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
          )}
        </View>

        <Text style={styles.label}>Deine Notizen (Cloud-Sync):</Text>
        <TextInput
          style={styles.input}
          placeholder="Notizen hier..."
          value={userText}
          onChangeText={setUserText}
          multiline
        />

<<<<<<< HEAD
        <TouchableOpacity style={styles.testButton} onPress={onTest} disabled={loading}>
          <Text style={styles.buttonText}>Verbindung testen (/status)</Text>
=======
        <TouchableOpacity style={styles.testButton} onPress={onTest}>
          <Text style={styles.buttonText}>Verbindung testen</Text>
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Speichern & Ausloggen</Text>
        </TouchableOpacity>

        {/* 🔴 Nutzerkonto löschen -> öffnet Modal */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={openDeleteModal}
          disabled={loading}
        >
          <Text style={styles.deleteButtonText}>Konto endgültig löschen</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Passwort-Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Konto löschen</Text>
            <Text style={styles.modalText}>
              Bitte gib dein Passwort ein, um das Löschen zu bestätigen.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Passwort"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, styles.modalBtnSecondary]} onPress={closeDeleteModal}>
                <Text style={styles.modalBtnTextSecondary}>Abbrechen</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, styles.modalBtnDanger]}
                onPress={confirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalBtnTextDanger}>Löschen</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
<<<<<<< HEAD
  scrollContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, paddingTop: 60 },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

=======
  scrollContainer: { alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  map: { width: '100%', height: '100%' },
  mapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 20
  },
  hintText: { fontSize: 11, color: '#888', marginTop: 15, textAlign: 'center' },
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
  messageBox: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
<<<<<<< HEAD
  messageText: { color: '#007AFF', textAlign: 'center', fontWeight: '500' },

  label: { alignSelf: 'flex-start', marginBottom: 5, fontWeight: '600', color: '#666' },
  input: {
    width: '100%',
    height: 120,
=======
  messageText: { color: '#007AFF', textAlign: 'center' },
  label: { alignSelf: 'flex-start', marginBottom: 5, fontWeight: '600', color: '#666' },
  input: {
    width: '100%',
    height: 80,
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
<<<<<<< HEAD
    textAlignVertical: 'top'
  },

=======
    textAlignVertical: 'top',
  },
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
  testButton: { backgroundColor: '#5856D6', paddingVertical: 12, borderRadius: 10, width: '100%', marginTop: 20 },
  logoutButton: { backgroundColor: '#FF3B30', paddingVertical: 15, borderRadius: 10, width: '100%', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  deleteButton: {
    marginTop: 20,
    backgroundColor: "#c62828",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e6e6e6"
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalText: { color: "#444", marginBottom: 12, lineHeight: 18 },

  modalInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 14
  },

  modalActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, minWidth: 110, alignItems: "center" },
  modalBtnSecondary: { backgroundColor: "#f2f2f2" },
  modalBtnDanger: { backgroundColor: "#c62828" },

  modalBtnTextSecondary: { color: "#333", fontWeight: "700" },
  modalBtnTextDanger: { color: "#fff", fontWeight: "700" },
});
