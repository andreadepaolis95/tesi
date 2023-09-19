const getChartColor = (color) => {

    let backgroundColor;
    let borderColor;

    if(color == 0){
        backgroundColor =  'rgba(120, 76, 30, 0.3)',
        borderColor = 'rgba(35, 35, 255, 1)'
    }


    if(color == 1){
      backgroundColor =  'rgba(35, 35, 255, 0.3)',
      borderColor = 'rgba(35, 35, 255, 1)'
    }


    else if (color == 2){
        backgroundColor =  'rgba(168, 255, 35, 0.3)',
        borderColor = 'rgba(168, 255, 35, 1)'
    }


    else if (color == 3){
        backgroundColor =  'rgba(75, 35, 0, 0.3)',
        borderColor = 'rgba(75, 34, 192, 1)'
    }

    else if (color == 4){
        backgroundColor =  'rgba(75, 192, 192, 0.2)',
        borderColor = 'rgba(75, 192, 192, 1)'
    }



    return {

        backgroundColor: backgroundColor,
        borderColor: borderColor
    
    }


}



module.exports = { getChartColor: getChartColor}