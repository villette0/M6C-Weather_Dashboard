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
    
    var icon = "";
    if (data.weather[0].main === "Rain") {
        icon = " 🌧";
    }
    if (data.weather[0].main === "Clear") {
        icon = " 🌞";
    }
    if (data.weather[0].main === "Clouds") {
        icon = " ☁️";
    }
    if (data.weather[0].main === "Snow") {
        icon = " 🌨";
    }
    if (data.weather[0].main === "Thunderstorm") {
        icon = " ⛈️";
    }
    if (data.weather[0].main === "Drizzle") {
        icon = " 🌦";
    }
    if (data.weather[0].main === "Atmosphere") {
        icon = " 🌫";
    }
    ;

    cityHeaderEl.textContent = data.name + " (" + (moment().format("M/DD/YYYY")) +") " + data.weather[0].main + icon;
    tempEl.textContent = "Temperature: " +data.main.temp + " °F";;
    windEl.textContent = "Wind: " + data.wind.speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.main.humidity + " %";
    getUvIndex(data.coord.lat, data.coord.lon);

    uvIndexEl.classList = 'uv-index'
    cityHeaderEl.classList = 'city-header';
    todaysWeatherContainerEl.classList = 'today-weather-container';

    cityHeaderEl.appendChild(tempEl);
    cityHeaderEl.appendChild(windEl);
    cityHeaderEl.appendChild(humidityEl);
    cityHeaderEl.appendChild(uvIndexEl);
    todaysWeatherContainerEl.appendChild(cityHeaderEl);
    weatherContainerEl.appendChild(todaysWeatherContainerEl);

    getFiveDayForecast(data.coord.lat, data.coord.lon);


};


function getUvIndex (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily" + "&appid=" + APIKey;
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                // console.log(data.current.uvi); <<this number is what I will use in the displayUvi function
                displayUvi(data);
            });
        } 
    });
}

function displayUvi (data) {
    var uvIndexEl = document.querySelector('.uv-index');
    uvIndexEl.textContent = "UV Index: " + data.current.uvi;

    var uvi = data.current.uvi;
    // Low UV
    if (uvi < 3) {
        uvIndexEl.style.backgroundColor = 'green';
        uvIndexEl.style.color = "white";
        uvIndexEl.style.width = "10rem";
    }
    // Moderate UV
    if (uvi > 2 && uvi < 6) {
        uvIndexEl.style.backgroundColor = 'yellow';
        uvIndexEl.style.color = "black";
    }
    // High UV
    if (uvi > 5) {
        uvIndexEl.style.backgroundColor = 'red';
        uvIndexEl.style.color = "white";
    }
}


function getFiveDayForecast (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                displayFiveDayForecast(data);
            });
        } 
    });
}


function displayFiveDayForecast (data) {
    var fiveDayForecastContainerEl = document.createElement('div');
    var fiveDayHeaderEl = document.createElement('h2');
    var fiveDaysOnlyBoxEl = document.createElement('div');

    fiveDayHeaderEl.textContent = "5 Day Forecast";

    fiveDaysOnlyBoxEl.classList = 'fivedaysonly-box';
    fiveDayHeaderEl.classList = 'fiveday-header';
    fiveDayForecastContainerEl.classList = 'fiveday-container';

    fiveDayForecastContainerEl.appendChild(fiveDayHeaderEl);
    fiveDayForecastContainerEl.appendChild(fiveDaysOnlyBoxEl);
    weatherContainerEl.appendChild(fiveDayForecastContainerEl);

    var dayArray = [0, 10, 2, 3, 4]
    for (var i = 0; i < dayArray.length; i++) {
    var dayContainerEl = document.createElement('div');
    var dateEl = document.createElement('p'); //(data.list[i].dt_txt);
    var iconEl = document.createElement('p'); //(data.list[i].weather[0].main);
    var tempEl = document.createElement('p'); //(data.list[i].main.temp);
    var windEl = document.createElement('p'); //(data.list[i].wind.speed);
    var humidityEl = document.createElement('p'); //(data.list[i].main.humidity);

    dateEl.textContent = data.list[i].dt_txt;
    iconEl.textContent = data.list[i].weather[0].main;
    tempEl.textContent = "Temperature: " + data.list[i].main.temp + " °F";
    windEl.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + " %";

    dayContainerEl.classList = 'day-container';

    dayContainerEl.appendChild(dateEl);
    dayContainerEl.appendChild(iconEl);
    dayContainerEl.appendChild(tempEl);
    dayContainerEl.appendChild(windEl);
    dayContainerEl.appendChild(humidityEl);
    fiveDaysOnlyBoxEl.appendChild(dayContainerEl);
    }

}



cityFormEl.addEventListener('submit', formSubmitHandler);


