const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Erlaubt der Mobile App den Zugriff
app.use(express.json());

// Euer Test-Endpunkt
app.get('/status', (req, res) => {
  res.json({ status: 'Backend auf Google Cloud ist ONLINE! 🚀' });
});

// Der Port muss über eine Umgebungsvariable von Google gesetzt werden
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});