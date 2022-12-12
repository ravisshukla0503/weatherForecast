const countryApi='https://api.countrystatecity.in/v1/countries';
const countryApiKey='R3NUdUE3RTdlbWt5ckF3WEJLMkFwQ0VJWDNUaThLUGdrU09VZEhuaA==';

let countryDropDown=document.getElementById('countryList');
let stateDropDown=document.getElementById('stateList');
let cityDropDown=document.getElementById('cityList');


const getCountry=async(fieldname, ...args)=>{

    let api;

    switch(fieldname){

        case 'countries':
            api='https://api.countrystatecity.in/v1/countries'
            break;

        case 'states':
            api=`https://api.countrystatecity.in/v1/countries/${args[0]}/states`
            break;

        case 'cities': 
            api=`https://api.countrystatecity.in/v1/countries/${args[0]}/states/${args[1]}/cities`
            default:  
    }

    let response=await fetch( api, {
        headers: {'X-CSCAPI-KEY': countryApiKey}
    });
    const countries= await response.json();
    return countries;
}

getCountry('countries')
.then((countries)=>{
    let countryOptions=' ';
    if(countries){
        countryOptions+='<option value=" ">Country</option>'
        countries.forEach((country)=> {
            countryOptions+=`<option value='${country.iso2}'>${country.name}</option>`
        });
    }
    countryDropDown.innerHTML=countryOptions;
})

countryDropDown.addEventListener('change',async()=>{
    let countryCode=countryDropDown.value;
    let states=await getCountry('states', countryCode);
    let stateOptions=' ';
    if(states){
        stateOptions+='<option value=" ">State</option>'
        Array.from(states).forEach((state)=> {
            stateOptions+=`<option value='${state.iso2}'>${state.name}</option>`
        });
    }
    stateDropDown.innerHTML=stateOptions;
})

stateDropDown.addEventListener('change',async()=>{
    let countryCode=countryDropDown.value;
    let stateCode=stateDropDown.value;
    let cities=await getCountry('cities',countryCode,stateCode);
    let cityOptions=' ';
    if(cities){
        cityOptions+='<option value=" ">City</option>'
        Array.from(cities).forEach((city)=> {
            cityOptions+=`<option value='${city.iso2}'>${city.name}</option>`
        });
    }
    cityDropDown.innerHTML=cityOptions;
})

cityDropDown.addEventListener('change',async()=>{
    let countryCode=countryDropDown.value;
    let cityCode=cityDropDown.value;
    const weather=await getWeather(countryCode,cityCode);
    console.log(weather);
    displayWeather(weather);
})

const getWeather=async(countryCode,cityCode)=>{
    const weatherInfo=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityCode},${countryCode.toLowerCase()}&APPID=d78442427c081e079736d3e0b317ec5c`)
    if(!weatherInfo.status==200){
        console.log("Something went wrong")
    }
    const weather=await weatherInfo.json();
    return weather;
}

const displayWeather=async(data)=>{
    const weatherDisplay=document.getElementById('weatherInfo');
    const weatherInformation=`<div>temp : ${data.main.temp} <br>
     temp_max : ${data.main.temp_max} <br>
     temp_min : ${data.main.temp_min} <br>
     Wind_speed : ${data.wind.speed}<br>
    </div>`
    weatherDisplay.innerHTML=weatherInformation;
}
