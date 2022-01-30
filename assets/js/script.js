
var weatherDetailContainer = document.querySelector("#cityWeather");
var searchBtn = document.querySelector("#searchBtn");
var citySearchDiv = document.querySelector("#input-group");
var cityFormEl= document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#cityInput");
var forecastContainerEl = document.querySelector("#forecast-container");
var searchHistoryBtn = document.querySelector("#search-history-btn")
var cities = [];


var formSumbitHandler = function(event){
     // prevent page from refreshing
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();
    if (city){
        getWeather(city);
        fiveDayForecast(city);
        cities.unshift({city});
        // clear old content
        cityInputEl.value = "";
        // user must enter a city
    } else {
        alert("Please enter a city");
    }
    saveSearch();
    searchHistory(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

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
    weatherDetailContainer.textContent= "";  
    //display searched city name
    var currentCity = document.createElement('h2');
    currentCity.textContent = weatherResults.name;
    weatherDetailContainer.appendChild(currentCity);
    //display current date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment().format("MMM D, YYYY h:mm a") + ") ";
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

var fiveDayForecast = function(city) {
    forecastContainerEl.textContent = ""
    var apiKey = "99edf6959fb1a88410ca2862d0a12b92";
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
    .then(response => response.json())
        .then(data => { 
            console.log(data)
            display5DayForecast(data);
        });
    };


var display5DayForecast = function(weatherResults) {
    var forecast = weatherResults.list;
    for(var i = 5; i < forecast.length; i= i + 8){
    var dailyForecast = forecast[i];
   
    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    console.log(dailyForecast);

    //display 5day date
    var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       //display weather icon
       var forecastImage = document.createElement('img');
       forecastImage.src = ` http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
       forecastImage.style.width = '30%';
       forecastEl.appendChild(forecastImage);

        //display temp
        var forecastTemp = document.createElement('span');
        forecastTemp.textContent = "Temp: " + dailyForecast.main.temp + " °F";
        forecastTemp.classList = "card-body";
        forecastEl.appendChild(forecastTemp);

        //display wind
        var forecastWind = document.createElement('span');
        forecastWind.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
        forecastWind.classList = "card-body";
        forecastEl.appendChild(forecastWind);

        //display humidity
        var forecastHumidity = document.createElement('span');
        forecastHumidity.textContent = "Humidity: " + dailyForecast.main.humidity + " %";
        forecastHumidity.classList = "card-body";
        forecastEl.appendChild(forecastHumidity);


       //append to forecast div
       forecastContainerEl.appendChild(forecastEl);
    }
}


var searchHistory = function(searchHistory) {
    console.log(searchHistory);
    var searchHistoryEl = document.createElement('button');
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.setAttribute("data-city", searchHistory);
    searchHistoryEl.setAttribute("type", "submit");

    searchHistoryBtn.prepend(searchHistoryEl);
}

var pastSearchLoad = function(event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getWeather(city);
        fiveDayForecast(city);
    }
}


// event listener for search form
cityFormEl.addEventListener("submit", formSumbitHandler);
searchHistoryBtn.addEventListener("click", pastSearchLoad);
