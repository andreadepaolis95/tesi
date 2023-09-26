const fs = require('fs').promises;
const { getCountryFromIp } = require('./ipRetriver');


const logDownloadRecord = async(filePath,clientIp,logFilePath, downloadTime) =>{
        // Calcola il tempo trascorso per il download

        const fileSizeBytes = await fs.stat(filePath).catch(e => console.log(e)); // Dimensione del file in byte
        const fileSizeBits = fileSizeBytes.size * 8; // Dimensione del file in bit
        const bitRate = fileSizeBits / downloadTime; // Calcolo del bit rate in bit al secondo
     
        // Registra il tempo di download, il bit rate e la nazione nel file di log
        const newLogRecord = { 
                 ip : clientIp,
                 country : await getCountryFromIp(clientIp),
                 download_time: downloadTime , 
                 bit: bitRate.toFixed(2),
                 date: Date.now(),
                 fileSize: fileSizeBytes.size

               }

            
        let data = await fs.readFile(logFilePath,'utf-8');
     
           // Analizza il contenuto del file in un oggetto JavaScript
        const LogDataSet = JSON.parse(data);
               
           // Modifica l'array JSON aggiungendo un valore (esempio: un oggetto)
        LogDataSet.push(newLogRecord);
               
                   // Converte l'oggetto JavaScript modificato in formato JSON
        const LogDataSetAsString = JSON.stringify(LogDataSet, null, 2);
        
                   // Scrivi il nuovo contenuto nel file
        await fs.writeFile(logFilePath, LogDataSetAsString);

        console.log(`Il file ${logFilePath} è stato aggiornato con successo. Download del file in ${downloadTime}ms`);

}



const cleanLogFile = async(logFilePath) =>{


        const emptyArray = [];

        const emptyArrayAsString = JSON.stringify(emptyArray, null, 2);

        await fs.writeFile(logFilePath, emptyArrayAsString);
        
        return;

};





module.exports = { logDownloadRecord : logDownloadRecord, cleanLogFile: cleanLogFile}