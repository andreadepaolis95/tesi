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
      <style> 
      
      html{
        background-color: rgb(229, 210, 248);
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }


      .header {
        margin-top: 50px;
        width: 100%;
        text-align: center;
        
      }


      .box{
        display: flex;
        width: 100%;
        margin-top: 7%;
        flex-wrap: wrap;
    }


      .card{

        border-radius: 8px;
        min-height: 400px;
        min-width: 400px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background-color: white;
        padding: 15px;
        margin: 10px;
      

      }
      
      </style>
    </head>
    <body>
    <div class="header">
      <h1>Grafico</h1>
    </div>
    <div class="box">
      `
      
      ;
      let count = 0;
      for(let key of dataMap.keys()){
        count ++;
        const chart = await generateChart(dataMap.get(key), count);
          html = html + 
          `<div class="card">
          <h3>Test Case: ${key}<h3>
          <img src="data:image/png;base64,${chart}" alt="Grafico" />
          </div>
          `
         
      }
      `</div>
    </body>
  </html>
`;
return html;

}

module.exports = {loadHomePageHtml: loadHomePageHtml, loadGraphPageHtml: loadGraphPageHtml }