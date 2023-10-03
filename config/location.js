const getLocation = (country) => {

    let location;
    let distance;
    let distanceAsString;

    if(country == 'Sweden'){
        location = 'Linköping, Sweden';
        distance = 1026.28,
        distanceAsString = '1026.28';

    } else if( country == 'United States'){
        location = 'Ashburn, United States';
        distance = 7517.13;
        distanceAsString = '7517.13';

    } else if( country == 'Italy'){
        location = 'Rome, Italy';
        distance = 959.40;
        distanceAsString = '959.40';
        
    } else if( country == 'Singapore'){
        location  = 'Singapore, Singapore';
        distance = 10257.59;
        distanceAsString = '10257.59';

        
    }

    return {
        location: location,
        distance: distance,
        distanceAsString: distanceAsString
    }



}


module.exports = { getLocation: getLocation};