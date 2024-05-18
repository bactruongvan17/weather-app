const latDefault = '21.0294498';
const lonDefault = '105.8544441';

let elInputLocation;
let elLocationSuggestion;

bootstrap();

function bootstrap() {
    elInputLocation = document.querySelector('#form-location input');
    elInputLocation.addEventListener('input', _debounce(queryLocation));

    // query weather default: Vietnam
    queryWeather(latDefault, lonDefault);
}

async function queryWeather(lat, lon) {
    // const url = 'http://127.0.0.1:3000/fake-weather.json';
    const url = `https://proxy-node-server-5nth.onrender.com/openweathermap/forecast?lat=${lat}&lon=${lon}`;
    const data = await _fetch(url);

    _renderWeatherNow(data);
    _renderWeatherHistory(data.list ?? []);

    const el = document.getElementById('time-now');
    setInterval(() => {
        el.textContent = _timeNow();
    }, 60000);
}

function _renderWeatherNow(data) {
    const weather = data.list[0];
    const city = data.city;

    const temp = kelvinToCelsius(weather.main.temp);
    const icon = weather.weather[0].icon + '.png';
    const location = city.name + ', ' + city.country;
    const minTemp = kelvinToCelsius(weather.main.temp_min);
    const maxTemp = kelvinToCelsius(weather.main.temp_max);
    const tempFeelsLike = kelvinToCelsius(weather.main.feels_like);
    const day = dateToDayOfWeek((new Date).toString(), false);

    const elRoot = document.getElementById('weather-now');
    elRoot.innerHTML = '';

    const elTopTemp = document.createElement('div');
    elTopTemp.classList.add('top-temp');
    elTopTemp.innerHTML = `<span>${temp}<sup>o</sup></span><img src="./images/${icon}" />`;

    const elLocation = document.createElement('div');
    elLocation.classList.add('curr-location');
    elLocation.innerHTML = `<span>${location}</span><img src="./images/location.png" />`;

    const elTemp = document.createElement('div');
    elTemp.classList.add('temp');
    elTemp.innerHTML = `<span>${minTemp}<sup>o</sup></span> / ` +
        `<span>${maxTemp}<sup>o</sup></span> / ` + 
        `Feels like ${tempFeelsLike}<sup>o</sup>`;

    const elDateTime = document.createElement('div');
    elDateTime.classList.add('date-time');
    elDateTime.innerHTML = `<span>${day}, </span><span id="time-now">${_timeNow()}</span>`;

    elRoot.appendChild(elTopTemp);
    elRoot.appendChild(elLocation);
    elRoot.appendChild(elTemp);
    elRoot.appendChild(elDateTime);
}

function _renderWeatherHistory(data) {
    const dataByDate = new Map();
    for (const item of data) {
        const date = item.dt_txt.split(" ")[0];
        if (dataByDate.has(date)) {
            continue;
        }
        dataByDate.set(date, {
            day: dateToDayOfWeek(date),
            humidity: item.main.humidity,
            weather_icons: item.weather.slice(0, 2).map(it => it.icon),
            min_temp: kelvinToCelsius(item.main.temp_min),
            max_temp: kelvinToCelsius(item.main.temp_max),
        });
    }

    const elRoot = document.getElementById('weather-history');
    elRoot.innerHTML = "";
    for (const [key, value] of dataByDate) {
        const elItem = document.createElement('div');
        elItem.classList.add('w-history-item');

        const elItemDate = document.createElement('div');
        elItemDate.classList.add('date');
        elItemDate.textContent = value.day;

        const elItemHumidity = document.createElement('div');
        elItemHumidity.classList.add('humidity');
        const elIconHumidity = document.createElement('img');
        elIconHumidity.setAttribute('src', './images/humidity.png');
        const elHumidityValue = document.createElement('span');
        elHumidityValue.textContent = `${value.humidity} %`;

        elItemHumidity.appendChild(elIconHumidity);
        elItemHumidity.appendChild(elHumidityValue);

        const elItemWeatherIcon = document.createElement('div');
        elItemWeatherIcon.classList.add('weather-icon');
        const elIconWeather = document.createElement('img');
        elIconWeather.setAttribute('src', `./images/${value.weather_icons[0]}.png`);
        elItemWeatherIcon.appendChild(elIconWeather);

        const elItemTemp = document.createElement('div');
        elItemTemp.classList.add('weather-temp');
        const elMinTemp = document.createElement('span');
        elMinTemp.innerHTML = `${value.min_temp}<sup>o</sup>`;
        const elMaxTemp = document.createElement('span');
        elMaxTemp.innerHTML = `${value.max_temp}<sup>o</sup>`;

        elItemTemp.appendChild(elMinTemp);
        elItemTemp.appendChild(elMaxTemp);

        elItem.appendChild(elItemDate);
        elItem.appendChild(elItemHumidity);
        elItem.appendChild(elItemWeatherIcon);
        elItem.appendChild(elItemTemp);

        elRoot.appendChild(elItem);
    }

    elRoot.style.display = 'block';
}

async function queryLocation() {
    const input = elInputLocation.value.trim();
    if (!input.length) {
        return;
    }

    // const url = 'http://127.0.0.1:3000/fake-location.json';
    const url = `https://proxy-node-server-5nth.onrender.com/openweathermap/geocoding?location=${input}`;
    const locations = await _fetch(url);

    _renderLocationSuggesstion(locations);
}

function selectLocation(lat, lon) {
    elLocationSuggestion.style.display = 'none';
    queryWeather(lat, lon);
}

function _renderLocationSuggesstion(locations) {
    elLocationSuggestion = document.getElementsByClassName('location-suggestion')[0];
    elLocationSuggestion.innerHTML = '';

    for (const location of locations) {
        const elItem = document.createElement('div');
        elItem.classList.add('location-item');
        elItem.setAttribute('data-lat-value', location.lat);
        elItem.setAttribute('data-lon-value', location.lon);
        elItem.addEventListener('click', () => selectLocation(location.lat, location.lon));

        const elName = document.createElement('span');
        const locationName = location.name;
        if (location.state) {
            locationName += `, ${location.state}`;
        }
        if (location.country) {
            locationName += `, ${location.country}`;
        }
        elName.textContent = locationName;

        elItem.appendChild(elName);

        elLocationSuggestion.appendChild(elItem);
    }
    
    if (locations.length) {
        elLocationSuggestion.style.display = 'block';
    }
}

function _debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args) }, timeout);
    }
}

async function _fetch(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-type': 'application/json'
        }
    });

    return resp.json();
}

function dateToDayOfWeek(date, returnToDay = true) {
    Date.prototype.formatYYYYMMDD = function () {
        return `${this.getFullYear()}-${this.getMonth()}-${this.getDate()}`;
    }

    const d = new Date(date);
    const dayOfWeek = d.getDay();

    if (returnToDay) {
        const now = new Date();
        if (d.formatYYYYMMDD() === now.formatYYYYMMDD()) {
            return 'Today';
        }
    }

    switch (dayOfWeek) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thurdday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
    }
}

function kelvinToCelsius(temp) {
    return Math.round(temp - 272.15);
}

function _timeNow() {
    const d = new Date();
    return d.getHours() + ":" + d.getMinutes();
}