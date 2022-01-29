
var weatherDetailContainer = document.querySelector("#cityWeather");
var searchBtn = document.querySelector("#searchBtn");
var citySearchDiv = document.querySelector("#input-group");
var cityFormEl= document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#cityInput");




var formSumbitHandler = function(event){
     // prevent page from refreshing
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();
    if (city){
        getWeather(city);
        // clear old content
        cityInputEl.value = "";
        // user must enter a city
    } else {
        alert("Please enter a city");
    }
}

var getWeather = function(city) {
    // personal api key to access OpenWeatherAPI
    var apiKey = "99edf6959fb1a88410ca2862d0a12b92";
      // format the Open Weather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

     // make a get request to url
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => { 
            console.log(data)
            displayWeather(data);
        });
};

var displayWeather = function(weatherResults) {
    //display searched city name
    var currentCity = document.createElement('h2');
    currentCity.textContent = weatherResults.name;
    weatherDetailContainer.appendChild(currentCity);
    //display current date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment().format("MMM D, YYYY") + ") ";
    currentCity.appendChild(currentDate);

    //create a span element to hold temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weatherResults.main.temp + " °F";
   weatherDetailContainer.appendChild(temperatureEl);

   //display weather icon
   var image = document.createElement('img');
   image.src = ` http://openweathermap.org/img/wn/${weatherResults.weather[0].icon}@2x.png`
   currentCity.appendChild(image);

   //display wind
   var windEl = document.createElement('span');
   windEl.textContent = "Wind: " + weatherResults.wind.speed + " MPH";
   weatherDetailContainer.appendChild(windEl);

   //display humidity
   var humidityEl = document.createElement('span');
   humidityEl.textContent = "Humidity: " + weatherResults.main.humidity + " %";
   weatherDetailContainer.appendChild(humidityEl);

   //lat and lon values needed for api call in uvIndex function
   var lat = weatherResults.coord.lat;
   var lon = weatherResults.coord.lon;
   uvIndex(lat,lon);
}

var uvIndex = function(lat, lon) {
    var apiKey = "99edf6959fb1a88410ca2862d0a12b92";
    // api url for uv index
    var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

   
    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
    console.log(lat);
    console.log(lon);
}

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";

    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;
// change background color of UV index depending on value
    if(index.value <=2){
        uvIndexValue.style.backgroundColor = "green";
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.style.backgroundColor = "yellow"
    }
    else if(index.value >8){
        uvIndexValue.style.backgroundColor = "red";
    };
// append values to weather detail container
    uvIndexEl.appendChild(uvIndexValue);
    weatherDetailContainer.appendChild(uvIndexEl);
}

// event listener for search form
cityFormEl.addEventListener("submit", formSumbitHandler);
