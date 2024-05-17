const API_KEY = 'f41e538d2970ae6ffd12cbe4ec6fa906';

let elInputLocation;
let elLocationSuggestion;

bootstrap();

function bootstrap() {
    elInputLocation = document.querySelector('#form-location input');
    elInputLocation.addEventListener('input', _debounce(queryLocation));
}

async function queryWeather(lat, lon) {
    const url = 'http://127.0.0.1:3000/fake-weather.json';
    // const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const data = await _fetch(url);

    _renderWeatherHistory(data.list ?? []);
}

function _renderWeatherHistory(data) {
    const dataByDate = new Map();
    for (const item of data) {
        const date = item.dt_txt.split(" ")[0];
        if (dataByDate.has(date)) {
            continue;
        }
        dataByDate.set(date, {
            humidity: item.main.humidity,
            weather_icons: item.weather.slice(0, 2).map(it => it.icon),
            min_temp: item.main.temp_min,
            max_temp: item.main.temp_max,
        });
    }

    console.log(dataByDate);
}

async function queryLocation() {
    const input = elInputLocation.value.trim();
    if (!input.length) {
        return;
    }

    const url = 'http://127.0.0.1:3000/fake-location.json';
    // const url = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=10&appid=${API_KEY}`;
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
        elName.textContent = `${location.name}, ${location.state}, ${location.country}`;

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