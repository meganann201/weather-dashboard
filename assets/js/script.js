
var weatherDetailContainer = document.querySelector("#weatherDetail");
var searchBtn = document.querySelector("#searchBtn");
var citySearchDiv = document.querySelector("#input-group");
var cityFormEl= document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#cityInput")



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
    .then(function(response){
        // request was successful
        if (response.ok) {
            console.log(response)
            response.json().then(function(data){
                console.log(data);
        });
     } else {
            alert("Error: " + response.statusText);
        }
    });
};

// event listener for search form
cityFormEl.addEventListener("submit", formSumbitHandler);
