const fs = require('fs').promises;

const buildDataMapForChart = async(logFilePath) =>{

    let dataMap = new Map();
    let buff = await fs.readFile(logFilePath);
    let dataAsString = buff.toString();
    let dataAsJson = JSON.parse(dataAsString);
    dataAsJson = dataAsJson.sort((a,b) => a.country - b.country  )

    dataAsJson.forEach(element => {
    element.bit = element.bit / 1000000;
    element.testCase = new Date(element.date).toLocaleDateString() + ' - ' + determinaPeriodoDelGiorno(element.date);
    if(dataMap.has(element.testCase)){
      let valuesForCurrentDate = dataMap.get(element.testCase);
      valuesForCurrentDate.push(element);
      dataMap.set(element.testCase,valuesForCurrentDate);
    } else {
      dataMap.set(element.testCase,[element]);
    }
  });


  return dataMap;

}



function determinaPeriodoDelGiorno(date) {

  const data = new Date(date);

  // Estrai l'ora dalla data
  const ora = data.getHours();

  // Determina il periodo del giorno
  if (ora >= 5 && ora < 12) {
    return "Mattina";
  } else if (ora >= 12 && ora < 18) {
    return "Pomeriggio";
  } else if (ora >= 18 && ora < 22) {
    return "Sera";
  } else {
    return "Notte";
  }
}






module.exports = { buildDataMapForChart: buildDataMapForChart }