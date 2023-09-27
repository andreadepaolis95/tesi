const colorAssignedForCountry = [];

const getChartColor = (country) => {
    let color;
    if(colorAssignedForCountry.includes(country)){
        color = colorAssignedForCountry.indexOf(country) +1;

    } else {
        colorAssignedForCountry.push(country);
        color = colorAssignedForCountry.length;

    }
    

    let backgroundColor;
    let borderColor;

    if(color == 0){
        backgroundColor =  'rgba(120, 76, 30, 0.3)',
        borderColor = 'rgba(35, 35, 255, 1)'
    }


    if(color == 1){
      backgroundColor =  'rgba(66, 135, 245)',
      borderColor = 'rgba(66, 135, 245)'
    }


    else if (color == 2){
        backgroundColor =  'rgba(66, 245, 102)',
        borderColor = 'rgba(11, 77, 25)'
    }


    else if (color == 3){
        backgroundColor =  'rgba(237, 64, 171)',
        borderColor = 'rgba(237, 64, 171)'
    }

    else if (color == 4){
        backgroundColor =  'rgba(245, 44, 44)',
        borderColor = 'rgba(245, 44, 44)'
    }



    return {

        backgroundColor: backgroundColor,
        borderColor: borderColor
    
    }


}


const getIpCalloutOptions = (ipAddress) =>{

return {
    hostname: 'ip-api.com',
    port: 80,
    path: `/json/${ipAddress}`,
    method: 'GET',
    };
}




module.exports = { getChartColor: getChartColor, getIpCalloutOptions : getIpCalloutOptions}