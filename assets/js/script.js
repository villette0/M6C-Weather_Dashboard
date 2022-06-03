var cityFormEl = document.querySelector('#city-form');
var cityButtonsEL = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var citySearchTerm = document.querySelector('#city-search-term');
var APIKey = "b577339e9250e36ef369eb66eef9b999";


var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCityData(city);

        weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};


var getCityData = function (city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
            });
        
};


function displayWeather (data, city) {
    var todaysWeatherContainerEl = document.createElement('div');
    var cityHeaderEl = document.createElement('h3');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvIndexEl = document.createElement('p');
    
    cityHeaderEl.textContent = data.name + " Date and Cloudy";
    tempEl.textContent = "Temperature: " +data.main.temp + " °F";;
    windEl.textContent = "Wind: " + data.wind.speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.main.humidity + " %";
    uvIndexEl.textContent = "UV Index: " + data.main.humidity + " %";

    cityHeaderEl.classList = 'city-header';
    tempEl.classList = 'todays-weather-text';

    cityHeaderEl.appendChild(tempEl);
    cityHeaderEl.appendChild(windEl);
    cityHeaderEl.appendChild(humidityEl);
    cityHeaderEl.appendChild(uvIndexEl);
    todaysWeatherContainerEl.appendChild(cityHeaderEl);
    weatherContainerEl.appendChild(todaysWeatherContainerEl);
};

cityFormEl.addEventListener('submit', formSubmitHandler);


