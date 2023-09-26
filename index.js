const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const requestIp = require('request-ip');

const { logDownloadRecord, cleanLogFile , getLogRawData, updateRowData, deleteLast} = require('./business/logManager');
const { loadHomePageHtml , loadGraphPageHtml } = require('./business/htmlController');

// Definisci la directory che contiene i tuoi file
const assetsDirectory = path.join(__dirname, 'assets');

// Definisci il percorso del file di log
const logFilePath = path.join(__dirname, 'download.log');

app.use(cors());
app.use(requestIp.mw());

function handleGlobalError(error) {
  console.error("Errore globale catturato:");
  console.error(error.stack || error);

}

process.on('uncaughtException', (error) => {
  handleGlobalError(error);

});


app.get('/',async(req,res) =>{

  const html = await loadHomePageHtml();

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
    
})

app.get('/raw', async(req,res) =>{

  const html = await getLogRawData(logFilePath);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
    
})


app.get('/deleteLast', async(req,res) =>{

  await deleteLast(logFilePath, req.query.text);
  res.send('<h1>Log Saved</h1>');
   
})



app.get('/log',  async(req,res) =>{

  let html = await loadGraphPageHtml(logFilePath)

  res.send(html);

  res.end();
  
  
    
})


app.get('/updateRowData', async(req,res) =>{

   await updateRowData(logFilePath, req.query.text);
   res.send('<h1>Log Saved</h1>');

   res.end();
   
})


app.get('/clean', async(req,res) =>{

    await cleanLogFile(logFilePath);

    res.send('<h1>Log Restarted</h1>');

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
