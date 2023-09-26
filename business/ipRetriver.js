const http = require('http');
const { getIpCalloutOptions } = require('../config/config')


const getCountryFromIp = (ipAddress) => {
    return new Promise((resolve, reject) => {
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
                        if (result.country !== undefined) {
                            resolve(result.country);
                        } else {
                            reject(new Error('Country is undefined'));
                        }
                    } else {
                        reject(new Error('Impossibile trovare lo stato di provenienza per questo indirizzo IP.'));
                    }
                } catch (error) {
                    reject(new Error('Si è verificato un errore durante l\'analisi della risposta JSON: ' + error));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error('Si è verificato un errore durante la richiesta HTTP: ' + error));
        });

        req.end();
    });
};





module.exports = { getCountryFromIp : getCountryFromIp }