var cityFormEl = document.querySelector('#city-form');
var cityButtonsEL = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var citySearchTerm = document.querySelector('#city-search-term');
var APIKey = "b577339e9250e36ef369eb66eef9b999";


document.addEventListener('DOMContentLoaded', populateButton);
// Should this be here? research local storage
// populateButton();

var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCityData(city);
        saveCityName(city);
        weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};


function getCityData(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayCity(data);
                    getCoordinates(data.coord.lat, data.coord.lon);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });

};

function displayCity(data) {
    var todaysWeatherContainerEl = document.createElement('div');
    var cityHeaderEl = document.createElement('h3');

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

    cityHeaderEl.textContent = data.name + " (" + (moment().format("MM/DD/YYYY")) + ") " + data.weather[0].main + icon;

    todaysWeatherContainerEl.classList = 'today-weather-container';
    cityHeaderEl.classList = 'city-header';

    todaysWeatherContainerEl.appendChild(cityHeaderEl);
    weatherContainerEl.appendChild(todaysWeatherContainerEl);
}

function getCoordinates(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayCurrentWeather(data);
                    displayFiveDayForecast(data);
                });
            }
        });
}


function displayCurrentWeather(data) {
    var cityHeaderEl = document.querySelector('.city-header');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvIndexEl = document.createElement('p');

    tempEl.textContent = "Temperature: " + data.current.temp + " °F";;
    windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.current.humidity + " %";
    uvIndexEl.textContent = "UV Index: " + data.current.uvi;

    uvIndexEl.classList = 'uv-index'

    cityHeaderEl.appendChild(tempEl);
    cityHeaderEl.appendChild(windEl);
    cityHeaderEl.appendChild(humidityEl);
    cityHeaderEl.appendChild(uvIndexEl);
    changeUviColor(data);
};


function changeUviColor(data) {
    var uvIndexEl = document.querySelector('.uv-index');
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


function displayFiveDayForecast(data) {
    var fiveDayForecastContainerEl = document.createElement('div');
    var fiveDayHeaderEl = document.createElement('h2');
    var fiveDaysOnlyBoxEl = document.createElement('div');

    fiveDayHeaderEl.textContent = "5 Day Forecast";

    fiveDayForecastContainerEl.classList = 'fiveday-container';
    fiveDayHeaderEl.classList = 'fiveday-header';
    fiveDaysOnlyBoxEl.classList = 'fivedaysonly-box';

    fiveDayForecastContainerEl.appendChild(fiveDayHeaderEl);
    fiveDayForecastContainerEl.appendChild(fiveDaysOnlyBoxEl);
    weatherContainerEl.appendChild(fiveDayForecastContainerEl);

    //Daily forecast array for 5 upcoming days: 
    var dayArray = [0, 1, 2, 3, 4]
    for (var i = 0; i < dayArray.length; i++) {
        var dayContainerEl = document.createElement('div');
        var dateEl = document.createElement('p');  //?
        var iconEl = document.createElement('p');  //(data.daily[i].weather[0].main);
        var tempEl = document.createElement('p');  //(data.daily[i].temp);
        var windEl = document.createElement('p');  //(data.daily[i].wind_speed);
        var humidityEl = document.createElement('p');  //(data.daily[i].humidity);

        var icon = "";
        if (data.daily[i].weather[0].main === "Rain") {
            icon = "🌧";
        }
        if (data.daily[i].weather[0].main === "Clear") {
            icon = "🌞";
        }
        if (data.daily[i].weather[0].main === "Clouds") {
            icon = "☁️";
        }
        if (data.daily[i].weather[0].main === "Snow") {
            icon = "🌨";
        }
        if (data.daily[i].weather[0].main === "Thunderstorm") {
            icon = "⛈️";
        }
        if (data.daily[i].weather[0].main === "Drizzle") {
            icon = " 🌦";
        }
        if (data.daily[i].weather[0].main === "Atmosphere") {
            icon = "🌫";
        }
        ;

        var dayForward = "";
        var dayForwardArray = [1, 2, 3, 4, 5]
        dayForward = moment().add((dayForwardArray[i]), 'days').format("MM/DD/YYYY");
        // lookup units timestamp to convert date data from seconds as another way

        dateEl.textContent = dayForward;
        // Tip: to call array item if different from starting at 0 can be: ex. data.list[(dayArray[i])].wind.speed 
        iconEl.textContent = icon + " " + data.daily[i].weather[0].main;
        tempEl.textContent = "Temp: " + data.daily[i].temp.day + " °F";
        windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + " %";

        dayContainerEl.classList = 'day-container';

        dayContainerEl.appendChild(dateEl);
        dayContainerEl.appendChild(iconEl);
        dayContainerEl.appendChild(tempEl);
        dayContainerEl.appendChild(windEl);
        dayContainerEl.appendChild(humidityEl);
        fiveDaysOnlyBoxEl.appendChild(dayContainerEl);
    }

}

function saveCityName(city) {
    //Check if already have info in there
    let citiesArray;
    //if there are no todos in storage then make an empty array
    if (localStorage.getItem('cities') === null) {
        citiesArray = []; //an empty array
    }
    else {
        //else if there are cities then get them from the json object
        citiesArray = JSON.parse(localStorage.getItem('cities'));
    }
    //then push the todo item into the blank array
    citiesArray.push(city);
    localStorage.setItem('cities', JSON.stringify(citiesArray));
}


function populateButton() {
    //Check if already have info in there
    let citiesArray;
    //if there are no todos in storage then make an empty array
    if (localStorage.getItem('cities') === null) {
        citiesArray = []; //an empty array
    }
    else {
        //else if there are cities then get them from the json object
        citiesArray = JSON.parse(localStorage.getItem('cities'));
    }

    citiesArray.forEach(function (city) {
        var oldCityButtonEl = document.createElement('button');
        oldCityButtonEl.textContent = city;
        oldCityButtonEl.classList = 'btn';
        cityButtonsEL.appendChild(oldCityButtonEl);
        // oldCityButtonEl.addEventListener('click', getCityData(city));

    });
}


cityFormEl.addEventListener('submit', formSubmitHandler);