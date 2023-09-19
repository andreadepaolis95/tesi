const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {getChartColor} = require('../config/config');
// Crea un'istanza di ChartJSNodeCanvas
const width = 800; // Larghezza del grafico
const height = 500; // Altezza del grafico
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


// Funzione per generare il grafico
const generateChart = async(jsonData) => {
  let count = 0;
  const configuration = {
    type: 'bar',
    data: {
      labels: jsonData.map(item => new Date(item.date).toLocaleString()),
      datasets: [{
        label: 'Bit Rate (Mbps)',
        data: jsonData.map(item=>item.bit),
        ... getChartColor(1)
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return buffer.toString('base64');
};

 module.exports = { generateChart: generateChart}