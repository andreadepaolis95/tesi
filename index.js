const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const requestIp = require('request-ip');
const axios = require('axios');
const { generateChart } = require('./business/chartBuilder');
const { buildDataMapForChart } = require('./business/dataManager');
const {logDownloadRecord} = require('./business/logManager');

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


  let html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Grafico</title>
    </head>
    <body>
      <h1>Download</h1>
      <a href="/download?file=5">Download File 5Mb</a>
      <a href="/download?file=10">Download File 10Mb</a>
      <a href="/download?file=25">Download File 25Mb</a>
    </body>
  </html>
`;

res.send(html);

  res.end();

    
})






app.get('/log',  async(req,res) =>{

  let dataMap = await buildDataMapForChart(logFilePath);
  

  let html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Grafico</title>
    </head>
    <body>
      <h1>Grafico</h1>`;
      let count = 0;
      for(let key of dataMap.keys()){
        count ++;
        const chart = await generateChart(dataMap.get(key), count);
          html = html + 
          `<h3>IP: ${key}<h3>
          <img src="data:image/png;base64,${chart}" alt="Grafico" />`
      }


      `
    </body>
  </html>
`;

res.send(html);

  res.end();
  
  
    
})



// Configura la route per il download
app.get('/download', async (req, res) => {
  // Ottieni l'indirizzo IP del client dalla richiesta
  const clientIp = req.clientIp;
  const fileSelected = req.query.file;
  console.log(fileSelected);
  // Specifica il nome del file che vuoi scaricare
  const fileName = 'test' + fileSelected+ 'MB.txt';
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
      const endTime = Date.now();
      const downloadTime = endTime - startTime;

     await logDownloadRecord(filePath,clientIp,logFilePath,downloadTime);
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
