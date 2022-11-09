/*
YANG YANG
CS5610 HW5
NOV 9 2022
*/


//get the first button
document.getElementById('search_bt').addEventListener("click",handleClick);


function setUpFelonyDD(){
    var FelonyType = ['Rape','Robbery',	'Burglary',	'Larceny-theft',
'Motor vehicle theft',	'Arson',	'Prostitution and commercialized vice',	'Other sex offenses',
	'Narcotic drug laws',	'Gambling'	,'Other not specified',	'Suspected felony type'];

    var otherThanFelonyType = ['Domestic violence',	'Child killed by babysitter',	'Brawl due to influence of alcohol',	
    'Brawl due to influence of narcotics',	'Argument over money or property',	'Gangland killings',	
    'Juvenile gang killings',	'Institutional killings',	'Other-not specified','Unknown'];

    var option = "";

    for(var i = 0; i<FelonyType.length;i++){
        option += '<option value="'+FelonyType[i]+'">' + FelonyType[i] + "</option>"
    }
    console.log('woot')
    document.getElementById('dd_crimeType').innerHTML = option
}

setUpFelonyDD();


function setUpYearDD(){

    var option = "";
    for(var i = 2022; i>1972;i--){
        option +='<option value="'+i+'">' + i+ "</option>"
    }
    console.log('huuu')
    document.getElementById('dd_crimeyear').innerHTML = option
}

setUpYearDD();

function handleClick(){

}



//use check Status to handle reference error
const checkStatus = async(url) => {
    try{
        const response  = await fetch(url);
        //need to turn into check status function
        if(response.status !== 200){
            throw new ReferenceError('cannot fetch data');
        }

    }catch(err){
        if(err instanceof ReferenceError){
            alert(err.name+": " +err.message);
        }
        
    }
}

// API(Federal Bureau of Investigation Crime Data Explorer): https://crime-data-explorer.fr.cloud.gov/pages/docApi
// offense: burglary, robbery, not-specified, motor-vehicle-theft, larceny
// variable: age, count, ethnicity, race, sex
const getCrime = async (offense,variable) => {
    const root = 'https://api.usa.gov/crime/fbi/sapi/';
    const api_key = 'BtnyqBVRrYny5epoyrJPfNQj5fA7LjfUuH6exkfq';
    const url = `${root}/api/data/nibrs/${offense}/offender/national/${variable}?API_KEY=${api_key}`;


    checkStatus(url);

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

let crimelist = [];
const crimeData = document.getElementById('crimeData');

const getCrimeList = async () => {
    crimelist = await getCrime("rape", "sex");
    // console.log(typeof crimelist);
    // console.log(Object.getOwnPropertyNames(crimelist));
    // console.log(crimelist.results);
    // console.log(Object.getOwnPropertyNames(crimelist.results[2]));
    console.log(crimelist);

    const crimeArray = crimelist.results;
    console.log(crimeArray);
    console.log(crimeArray[0]);
    console.log(crimeArray[0].data_year);

    //populates data to table
    crimelist.results.map((e) => {
            var cell = document.createElement('tr');
            cell.innerHTML = `<th>` +  `${e.data_year}` + `</th> <th>` + `${e.female_count}` + `</th> <th>`+ `${e.male_count}` + `</th>  <th>` +  `${e.unknown}` + `</th>`;
            crimeData.appendChild(cell);
    });

}

document.getElementById('getCrimeList_bt').onclick = async() => {
    getCrimeList();
}


// getCrime("rape", "sex")
//     .then(data => console.log('resolved:',data))
//     .catch(err => console.log('rejected',err));


