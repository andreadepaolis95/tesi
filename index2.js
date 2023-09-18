const http = require('http');
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'download.log');


const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Bypass-Tunnel-Reminder' : true });
    res.write('<html><body>');
    res.write('<h1>Download File Example</h1>');
    res.write('<a href="/download">Download File</a>');
    res.write('</body></html>');
    res.end();
  } else if (req.url === '/download') {
    const filePath = path.join(__dirname,'assets' ,'test.txt');
    const fileName = 'test.txt';
    const startTime = Date.now();

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Bypass-Tunnel-Reminder': true
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res).on('finish', function(){


        // Calcola il tempo trascorso per il download
      const endTime = Date.now();
      const downloadTime = endTime - startTime;
    
        // Registra il tempo di download nel file di log
      const logData = `Tempo di download: ${downloadTime} ms\n`;
      fs.appendFile(logFilePath, logData, (err) => {
          if (err) {
            console.error('Errore nella registrazione del log:', err);
          } else {
            console.log('Log registrato con successo.');
      }
      });
  })
    


  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
