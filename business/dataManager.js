const fs = require('fs').promises;

const buildDataMapForChart = async(logFilePath) =>{

    let dataMap = new Map();
    let buff = await fs.readFile(logFilePath);
    let dataAsString = buff.toString();
    let dataAsJson = JSON.parse(dataAsString);
    dataAsJson.forEach(element => {
    element.bit = element.bit / 1000;
    if(dataMap.has(element.ip)){
      let valuesForCurrentIp = dataMap.get(element.ip);
      valuesForCurrentIp.push(element);
      dataMap.set(element.ip,valuesForCurrentIp);
    } else {
      dataMap.set(element.ip,[element]);
    }
  });


  return dataMap;

}




module.exports = {buildDataMapForChart: buildDataMapForChart }