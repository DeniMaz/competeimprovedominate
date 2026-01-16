const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
app.use(cors()); // Ermöglicht Cross-Origin-Requests von deiner App
app.use(express.json()); // Parst JSON-Bodies in Requests

// Initialisiere Firebase-Admin, falls noch nicht geschehen
if (!admin.apps.length) {
<<<<<<< HEAD
  admin.initializeApp();
}

// Zugriff auf Firestore
const db = getFirestore("cid-development-database");
=======
    admin.initializeApp(); // Hier könntest du Credentials hinzufügen, z.B. serviceAccountKey.json
}

/**
 * Zugriff auf die spezifische Firestore-Datenbankinstanz.
 * Accessing the specific Firestore database instance.
 */
const db = getFirestore("cid-development-database"); // Deine DB-Name
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab

// Status-Endpoint zum Testen
app.get('/status', (req, res) => {
  res.json({ nachricht: "Backend ist online! Hallo Welt!" });
});

<<<<<<< HEAD
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ fehler: "Daten unvollständig." });

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();
    if (doc.exists) return res.status(400).json({ fehler: "Benutzer existiert bereits." });
=======
/**
 * Registrierung eines neuen Benutzers.
 * Registration of a new user.
 * Speichert E-Mail, gehashtes Passwort und initial leere Tracking-Daten.
 */
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ fehler: "E-Mail oder Passwort fehlt." });

        const hashedPassword = await bcrypt.hash(password, 10); // Sicheres Hashing des Passworts
        const userRef = db.collection('users').doc(email); // Dokument-ID ist die E-Mail
        const doc = await userRef.get();
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab

    const hashedPassword = await bcrypt.hash(password, 10);

<<<<<<< HEAD
    await userRef.set({
      email,
      password: hashedPassword,
      userData: "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ nachricht: "Registrierung erfolgreich." });
  } catch (error) {
    res.status(500).json({ fehler: error.message });
  }
});

=======
        await userRef.set({
            email,
            password: hashedPassword,
            userData: { // Initiale Struktur für Fitness-Tracking-Daten (erweiterbar)
                workouts: [], // Array für Workouts (z.B. [{ date: '2026-01-16', type: 'Laufen', duration: 30 }])
                progress: {}, // Objekt für Fortschritte (z.B. { weight: 75, goals: 'Abnehmen' })
                lastSync: null // Letzte Synchronisation
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp() // Server-Zeitstempel
        });

        res.status(201).json({ nachricht: "Registrierung erfolgreich. Willkommen in der Fitness-App!" });
    } catch (error) {
        res.status(500).json({ fehler: `Fehler bei der Registrierung: ${error.message}` });
    }
});

/**
 * Login-Endpunkt: Überprüft Credentials und sendet gespeicherte Tracking-Daten zurück.
 * Login endpoint: Checks credentials and returns stored tracking data.
 */
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

<<<<<<< HEAD
    if (!doc.exists) return res.status(401).json({ fehler: "Benutzer nicht gefunden." });
=======
        const user = doc.data();
        const isMatch = await bcrypt.compare(password, user.password); // Vergleiche gehashtes Passwort
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab

    const user = doc.data();
    const isMatch = await bcrypt.compare(password, user.password);

<<<<<<< HEAD
    if (!isMatch) return res.status(401).json({ fehler: "Ungültiges Passwort." });

    res.status(200).json({
      nachricht: "Login erfolgreich.",
      user: {
        email: user.email,
        userData: user.userData || ""
      }
    });
  } catch (error) {
    res.status(500).json({ fehler: "Interner Serverfehler." });
  }
});

app.post('/save-data', async (req, res) => {
  try {
    const { email, userData } = req.body;
    if (!email) return res.status(400).json({ fehler: "E-Mail fehlt." });

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();
    if (!doc.exists) return res.status(404).json({ fehler: "Benutzer nicht gefunden." });

    await userRef.update({
      userData: userData ?? "",
      lastUpdate: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ nachricht: "Daten synchronisiert." });
  } catch (error) {
    res.status(500).json({ fehler: "Fehler beim Speichern." });
  }
});

// Nutzerkonto löschen (mit Passwort)
app.post('/delete-user', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ fehler: "Daten unvollständig." });
=======
        // Erfolg: Sende E-Mail und gespeicherte Fitness-Daten zurück
        res.status(200).json({
            nachricht: "Login erfolgreich.",
            user: {
                email: user.email,
                userData: user.userData || { workouts: [], progress: {} } // Rückgabe der Tracking-Daten
            }
        });
    } catch (error) {
        res.status(500).json({ fehler: `Interner Serverfehler: ${error.message}` });
    }
});

/**
 * Speichern der Benutzerdaten (z.B. neue Tracking-Daten).
 * Saving user data (e.g., new tracking data).
 * Die App sendet aktualisierte Daten, die hier überschrieben/aktualisiert werden.
 */
app.post('/save-data', async (req, res) => {
    try {
        const { email, userData } = req.body; // userData ist ein JSON-Objekt mit Tracking-Infos
        const userRef = db.collection('users').doc(email);

        await userRef.update({
            userData: userData, // Überschreibe die alten Daten mit den neuen
            lastUpdate: admin.firestore.FieldValue.serverTimestamp() // Aktualisierungs-Zeitstempel
        });

        res.status(200).json({ nachricht: "Tracking-Daten erfolgreich synchronisiert." });
    } catch (error) {
        res.status(500).json({ fehler: `Fehler beim Speichern der Daten: ${error.message}` });
>>>>>>> 017c5743c29f6f3112d146f281014f14c63b21ab
    }

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ fehler: "Benutzer nicht gefunden." });
    }

    const user = doc.data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ fehler: "Ungültiges Passwort." });
    }

    await userRef.delete();
    return res.status(200).json({ nachricht: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ fehler: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server läuft auf Port ${PORT}`);
});