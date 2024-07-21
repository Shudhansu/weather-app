const userTab = document.querySelector("[user-tab]");
const searchTab = document.querySelector("[search-tab]");

const grantAccessContainer = document.querySelector(".grant-access-container");
const loadingContainer = document.querySelector(".loading-container");
const searchWeatherContainer = document.querySelector(".search-weather-container");
const weatherInfoContainer = document.querySelector(".weather-info-container");

let currentTab = userTab;
currentTab.classList.add("tab");
const API = "ef1b29df8f2a8b0f65e409e703a71fd7";
userFunction();

function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("tab");
        currentTab = clickedTab;
        currentTab.classList.add("tab");

        if(!searchWeatherContainer.classList.contains("active")){
            grantAccessContainer.classList.remove("active");
            weatherInfoContainer.classList.remove("active");
            searchWeatherContainer.classList.add("active");
        }

        else{
            searchWeatherContainer.classList.remove("active");
            // grantAccessContainer.classList.add("active");
            userFunction();
        }
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

function userFunction(){
    const localStorage = sessionStorage.getItem("user-coordinates");

    if(!localStorage){
        searchWeatherContainer.classList.remove("active");
        weatherInfoContainer.classList.remove("active");
        grantAccessContainer.classList.add("active");
    }

    else{
        searchWeatherContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        // const userCoordinates = JSON.parse(localStorage);

        const dt = JSON.parse(localStorage);

        const lat = dt.lat;
        const long = dt.lon;

        // console.log(localStorage);

        callApi(lat,long);
    }
}

async function callApi(lat,long){

    // console.log("I am in call API");
    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");

    // console.log("1");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API}&units=metric`
          );
        const data =await response.json();
        loadingContainer.classList.remove("active");
        weatherInfoContainer.classList.add("active");
        // console.log("2");
        renderWeatherInfo(data);

    }

    catch(e){

    }
}

function renderWeatherInfo(data){
    const cityName = document.querySelector("[city-name]");
    const countrySymbol = document.querySelector("[country-symbol]");
    const weatherName = document.querySelector("[weather-name]");
    const weatherImage = document.querySelector("[weather-image]");
    const temperature = document.querySelector("[temperature]");
    const windSpeed = document.querySelector("[wind-speed]");
    const humidity = document.querySelector("[humidity]");
    const clouds = document.querySelector("[clouds]");

    cityName.innerText = data?.name;
    countrySymbol.src =  `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`; 
    weatherName.innerText = data?.weather?.[0]?.description;
    weatherImage.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${data?.main?.temp} °C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    clouds.innerText =  `${data?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

 async function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // ld = sessionStorage.getItem("user-coordinates");
    // let d = JSON.parse(ld);
    // console.log("Hi Saksham");
    // console.log(ld);
    // console.log(d);
    const lat = userCoordinates.lat;
    const long = userCoordinates.lon;
    callApi(lat,long);
    // userFunction();
}

// getLocation();

const grantAccessButton = document.querySelector(".grant-access-btn");

grantAccessButton.addEventListener('click',getLocation);

const searchInput = document.querySelector(".search");

// console.log(searchInput);

searchWeatherContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    weatherInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`
          );
        const data = await response.json();
        loadingContainer.classList.remove("active");
        weatherInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}

