// Universal variables from elements selected by id/class
var cityFormEl = document.querySelector('#city-form');
var cityButtonsContainerEL = document.querySelector('#city-buttons-container');
var cityInputEl = document.querySelector('#city');
var todayWeatherContainer = document.querySelector('.today-weather-container');
var weekWeatherContainer = document.querySelector('.week-weather-container');
var citySearchTerm = document.querySelector('#city-search-term');
var APIKey = "b577339e9250e36ef369eb66eef9b999";
var citiesArray; //for localstorage work

// Initial screen load
// Event listener to populate old search buttons from local storage
document.addEventListener('DOMContentLoaded', loadOldSearchButtons);

// Function on what to do when text is entered into the city search box
var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        // Gather the data from weather Api
        getCityData(city);
        // Save to local storage
        saveCityName(city);
        loadOldSearchButtons();
        todayWeatherContainer.textContent = '';
        weekWeatherContainer.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

// Function to gather data from current weather api, searching by city
function getCityData(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    // Call function to display results just for the city header
                    displayCity(data);
                    // Call function to get coordintaes from this data which we will convert to use One Api instead for more data availability
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

// Function just to display city header
function displayCity(data) {
    var cityHeaderEl = document.createElement('h4');

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

    cityHeaderEl.textContent = data.name + ",   " + (moment().format("dddd MM.DD")) + ",  " + data.weather[0].main + icon;
    cityHeaderEl.classList = 'city-header';

    todayWeatherContainer.appendChild(cityHeaderEl);

}

//Function to remove what's currently on page
function clearPage() {
    weekWeatherContainer.textContent = '';
    todayWeatherContainer.textContent = '';
    cityInputEl.value = '';
}

function createCityButton(cityName) {
    var oldCityButtonEl = document.createElement('button');
    oldCityButtonEl.textContent = cityName;
    oldCityButtonEl.classList = 'city-button';
    oldCityButtonEl.style = "text-transform: capitalize";
    oldCityButtonEl.dataset.city = cityName;
    cityButtonsContainerEL.appendChild(oldCityButtonEl);
    oldCityButtonEl.addEventListener('click', function() {
        var thisCity = this.getAttribute('data-city');
        clearPage();
        getCityData(thisCity);
    })
}

// Function to grab coordinates from current weather api, input them into One Api, and get results/data
function getCoordinates(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    // From this one Api, display current weather div
                    displayCurrentWeather(data);
                    // From this one Api, display five day forecast div
                    displayFiveDayForecast(data);
                });
            }
        });
}

// Function to display weather just for today from One Api call
function displayCurrentWeather(data) {
    todayWeatherContainer.style.display = 'block';
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    tempEl.textContent = "Temperature: " + data.current.temp + " °F";;
    windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.current.humidity + " %";


    todayWeatherContainer.appendChild(tempEl);
    todayWeatherContainer.appendChild(windEl);
    todayWeatherContainer.appendChild(humidityEl);
    makeUviWithColor(data);
};

// Function just for changing UVI color based on number's severity
function makeUviWithColor(data) {
    var uvIndex = document.createElement('p');
    uvIndex.classList = 'uv-index'
    var uvi = data.current.uvi;
    // Low UV
    if (uvi < 3) {
        uvIndex.textContent = "UV Index: " + data.current.uvi + " 🟢";
    }
    // Moderate UV
    if (uvi > 2 && uvi < 6) {
        uvIndex.textContent = "UV Index: " + data.current.uvi + " 🟡";
    }
    // High UV
    if (uvi > 5) {
        uvIndex.textContent = "UV Index: " + data.current.uvi + " 🔴";
    }
    todayWeatherContainer.appendChild(uvIndex);
}

// Function to display Five Day Forecast div
function displayFiveDayForecast(data) {

    //Daily forecast array for 5 upcoming days: 
    var dayArray = [0, 1, 2, 3, 4]
    for (var i = 0; i < dayArray.length; i++) {
        var dayContainerEl = document.createElement('div');
        dayContainerEl.classList= 'col day-container'
        var dateEl = document.createElement('p');  
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
        dayForward = moment().add((dayForwardArray[i]), 'days').format("dddd MM.DD");
        // lookup units timestamp to convert date data from seconds as another way

        dateEl.textContent = dayForward;
        // Tip: to call array item if different from starting at 0 can be: ex. data.list[(dayArray[i])].wind.speed 
        iconEl.textContent = icon + " " + data.daily[i].weather[0].main;
        tempEl.textContent = "Temp: " + data.daily[i].temp.day + " °F";
        windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + " %";

        dayContainerEl.appendChild(dateEl);
        dayContainerEl.appendChild(iconEl);
        dayContainerEl.appendChild(tempEl);
        dayContainerEl.appendChild(windEl);
        dayContainerEl.appendChild(humidityEl);
        weekWeatherContainer.appendChild(dayContainerEl);
    }

}

// Function to save the city name that is inputted into the search box into a local storage array
function saveCityName(city) {
    //Push the todo item into the blank array, if it isn't already there
    if (!citiesArray.includes(city.toLowerCase())) {
        citiesArray.push(city.toLowerCase());
        localStorage.setItem('cities', JSON.stringify(citiesArray));
    }
}


// Function for removing children
function removeChilds(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};


// Function for the document to load all the old search buttons and make them display the corresponding city day
function loadOldSearchButtons() {
    todayWeatherContainer.style.display = 'none';
    removeChilds(cityButtonsContainerEL);
    //if there are no todos in storage then make an empty array
    if (localStorage.getItem('cities') === null) {
        citiesArray = []; //an empty array
    }
    else {
        //else if there are cities then get them from the json object
        citiesArray = JSON.parse(localStorage.getItem('cities'));
    }
    // Arrow function, for each with a function with a parameter
    citiesArray.forEach((city) => createCityButton(city));
}

// Event listener that on click, formSubmitHandler function is called which then calls all other functions
cityFormEl.addEventListener('submit', formSubmitHandler);
