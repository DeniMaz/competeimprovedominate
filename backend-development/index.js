const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
app.use(cors());
app.use(express.json());

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = getFirestore("cid-development-database");

app.get('/status', (req, res) => {
  res.json({ nachricht: "Backend ist online! Hallo Welt!" });
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ fehler: "Daten unvollständig." });
    }

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();
    if (doc.exists) {
      return res.status(400).json({ fehler: "Benutzer existiert bereits." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.set({
      email,
      password: hashedPassword,
      userData: "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ nachricht: "Registrierung erfolgreich." });
  } catch (e) {
    res.status(500).json({ fehler: e.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(401).json({ fehler: "Benutzer nicht gefunden." });
    }

    const user = doc.data();
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ fehler: "Falsches Passwort." });
    }

    res.json({
      nachricht: "Login erfolgreich.",
      user: { email: user.email, userData: user.userData || "" }
    });
  } catch (e) {
    res.status(500).json({ fehler: e.message });
  }
});

app.post('/save-data', async (req, res) => {
  try {
    const { email, userData } = req.body;
    await db.collection('users').doc(email).update({
      userData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ nachricht: "Gespeichert." });
  } catch (e) {
    res.status(500).json({ fehler: e.message });
  }
});

app.post('/delete-account', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ fehler: "Email und Passwort erforderlich." });
    }

    // User aus Firestore laden
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ fehler: "Benutzer nicht gefunden." });
    }

    const userData = doc.data();

    // Passwort prüfen (weil du beim Register bcrypt nutzt)
    const ok = await bcrypt.compare(password, userData.password);
    if (!ok) {
      return res.status(401).json({ fehler: "Falsches Passwort." });
    }

    // Löschen
    await userRef.delete();

    return res.status(200).json({ nachricht: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ fehler: "Serverfehler beim Löschen." });
  }
});