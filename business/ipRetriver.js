const http = require('http');
const { getIpCalloutOptions } = require('../config/config')


const getCountryFromIp = async(ipAddress) => {
    // Crea una richiesta HTTP per ottenere lo stato di provenienza
    let country = 'Italy';
    const req = http.request(getIpCalloutOptions(ipAddress), (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const result = JSON.parse(data);
                if (result.status === 'success') {
                    console.log(`Stato di provenienza per l'indirizzo IP ${ipAddress}: ${result.country}`);
                    if(country != undefined){
                        country = result.country;
                    }
                } else {
                    console.error('Impossibile trovare lo stato di provenienza per questo indirizzo IP.');
                }
            } catch (error) {
                console.error('Si è verificato un errore durante l\'analisi della risposta JSON:', error);
            }
        });
    });

    req.on('error', (error) => { 
        console.error('Si è verificato un errore durante la richiesta HTTP:', error);
    });

    req.end();
    return country;
}



module.exports = { getCountryFromIp : getCountryFromIp }