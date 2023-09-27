const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {getChartColor} = require('../config/config');
// Crea un'istanza di ChartJSNodeCanvas
const width = 500; // Larghezza del grafico
const height = 300; // Altezza del grafico
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


// Funzione per generare il grafico
const generateChart = async(jsonData) => {

    const dataSetForIp = {};
    const countryColor = {};
    jsonData.forEach((element) => {
      const { country, bit } = element;
  
      if (!dataSetForIp[country]) {
        dataSetForIp[country] = { count: 0, totalBitrate: 0 };
      }
  
      dataSetForIp[country].count++;
      dataSetForIp[country].totalBitrate += bit;
      dataSetForIp[country]
    });
    let colorIndex = 0;
    let risultato = Object.keys(dataSetForIp).map((country) => {
      colorIndex++
      const { count, totalBitrate } = dataSetForIp[country];
      const mediaBitrate = totalBitrate / count;
  
      return {
        country: country,
        data: mediaBitrate,
        label: 'Bit Rate (Mbps) ' + country,
        stack: country,
        ...getChartColor(country), // Assegna il colore separatamente per ciascun dataset
      };
    });

    risultato = risultato.sort((a,b) => {
        const countryA = a.country.toUpperCase(); // Converte la stringa in maiuscolo per l'ordinamento senza distinzione tra maiuscole e minuscole
        const countryB = b.country.toUpperCase();

        if (countryA < countryB) {
          return -1; // a viene prima di b
        } else if (countryA > countryB) {
          return 1; // b viene prima di a
        } else {
          return 0; // a e b sono equivalenti
        }});

    let result = {};
    result.label = 'Bit Rate (Mbps)'
    result.data = risultato.map(item => item.data);
    result.backgroundColor = risultato.map(item => item.backgroundColor);
  
    const configuration = {
      type: 'bar',
      data: {
        labels: risultato.map((item) => item.country),
        datasets: [result]
        

      },
      options: {
        plugins: {
          legend:{ 
            labels:{
            boxWidth: 0
            }
        }},
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return buffer.toString('base64');
};

 module.exports = { generateChart: generateChart}