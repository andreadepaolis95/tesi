const fs = require('fs').promises;
const path = require('path');
const { generateChart } = require('./chartBuilder');
const { buildDataMapForChart } = require('./dataManager');


const loadHomePageHtml = async() =>{

    const homeHtmlFilePath = path.join(__dirname, '../public', 'home.html');

    let homePage = await fs.readFile(homeHtmlFilePath);

    return homePage;



}



const loadGraphPageHtml = async(logFilePath) => {



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
return html;

}

module.exports = {loadHomePageHtml: loadHomePageHtml, loadGraphPageHtml: loadGraphPageHtml }