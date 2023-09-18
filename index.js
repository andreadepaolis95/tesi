const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const requestIp = require('request-ip');
const axios = require('axios');

// Definisci la directory che contiene i tuoi file
const assetsDirectory = path.join(__dirname, 'assets');

// Definisci il percorso del file di log
const logFilePath = path.join(__dirname, 'download.log');

app.use(cors());
app.use(requestIp.mw());


app.use((req, res, next) => {
  // Ottieni l'indirizzo IP del client dalla richiesta
  const clientIp = req.clientIp;
  
  // Registra la richiesta nel log
  console.log(`Richiesta da ${clientIp} - URL: ${req.originalUrl}`);
  
  // Continua con la gestione della richiesta
  next();
});

app.get('/',(req,res) =>{

  res.writeHead(200, { 'Content-Type': 'text/html', 'Bypass-Tunnel-Reminder' : true });
    res.write('<html><body>');
    res.write('<h1>Download File Example</h1>');
    res.write('<a href="/download">Download File</a>');
    res.write('</body></html>');
    res.end();
    
})


// Configura la route per il download
app.get('/download', async (req, res) => {
  // Ottieni l'indirizzo IP del client dalla richiesta
  const clientIp = req.clientIp;

  // Specifica il nome del file che vuoi scaricare
  const fileName = 'test.txt';
  // Crea il percorso completo del file
  const filePath = path.join(assetsDirectory, fileName);

  // Registra l'orario di inizio del download
  const startTime = Date.now();

  try {
    // Effettua il download del file
    res.download(filePath, async(err) => {
      if (err) {
        console.log(err);
        // Gestisci gli errori, ad esempio il file non esiste
        res.status(404).send('File non trovato');
      }

      // Calcola il tempo trascorso per il download
      const endTime = Date.now();
      const downloadTime = endTime - startTime;

      // Ottieni la nazione associata all'indirizzo IP del client utilizzando ipinfo.io
      const response = await axios.get(`https://ipinfo.io/${clientIp}/country`);
      const country = response.data.trim();

      const fileSizeBytes = fs.statSync(filePath).size; // Dimensione del file in byte
      const fileSizeBits = fileSizeBytes * 8; // Dimensione del file in bit
      const bitRate = fileSizeBits / downloadTime; // Calcolo del bit rate in bit al secondo
      
      // Registra il tempo di download, il bit rate e la nazione nel file di log
      const logData = `Nazione: ${country}, Tempo di download: ${downloadTime} ms, Bit rate: ${bitRate.toFixed(2)} bps\n`;
      
      fs.appendFile(logFilePath, logData, (err) => {
        if (err) {
          console.error('Errore nella registrazione del log:', err);
        } else {
          console.log('Log registrato con successo.');
        }
      });
    });
  } catch (error) {
    console.error('Errore durante il recupero della nazione:', error);
    res.status(500).send('Errore durante il recupero della nazione');
  }
});

// Avvia il server sulla porta desiderata
const port = 3000;
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
