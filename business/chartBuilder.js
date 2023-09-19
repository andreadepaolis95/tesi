const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {getChartColor} = require('../config/config');
// Crea un'istanza di ChartJSNodeCanvas
const width = 500; // Larghezza del grafico
const height = 300; // Altezza del grafico
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


// Funzione per generare il grafico
const generateChart = async(jsonData) => {

    const dataSetForIp = {};
  
    jsonData.forEach((element) => {
      const { ip, bit } = element;
  
      if (!dataSetForIp[ip]) {
        dataSetForIp[ip] = { count: 0, totalBitrate: 0 };
      }
  
      dataSetForIp[ip].count++;
      dataSetForIp[ip].totalBitrate += bit;
      dataSetForIp[ip]
    });
    let colorIndex = 0;
    const risultato = Object.keys(dataSetForIp).map((ip) => {
      colorIndex++
      const { count, totalBitrate } = dataSetForIp[ip];
      const mediaBitrate = totalBitrate / count;
  
      return {
        ip: ip,
        data: mediaBitrate,
        label: 'Bit Rate (Mbps) ' + ip,
        stack: ip,
        ...getChartColor(colorIndex), // Assegna il colore separatamente per ciascun dataset
      };
    });
    
    let result = {};
    result.label = 'X:IP Address -- Y: Bit Rate (Mbps)'
    result.data = risultato.map(item => item.data);
    result.backgroundColor = risultato.map(item => item.backgroundColor);
  
    const configuration = {
      type: 'bar',
      data: {
        labels: risultato.map((item) => item.ip),
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