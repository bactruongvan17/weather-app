JSON format API response fields

cod Internal parameter
message Internal parameter
cntA number of timestamps returned in the API response
list
list.dt Time of data forecasted, unix, UTC
list.main
list.main.temp Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.feels_like This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.temp_min Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info here. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.temp_max Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info here. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.pressure Atmospheric pressure on the sea level by default, hPa
list.main.sea_level Atmospheric pressure on the sea level, hPa
list.main.grnd_level Atmospheric pressure on the ground level, hPa
list.main.humidity Humidity, %
list.main.temp_kf Internal parameter
list.weather
list.weather.id Weather condition id
list.weather.main Group of weather parameters (Rain, Snow, Clouds etc.)
list.weather.description Weather condition within the group. Please find more here. You can get the output in your language. Learn more
list.weather.icon Weather icon id
list.clouds
list.clouds.all Cloudiness, %
list.wind
list.wind.speed Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
list.wind.deg Wind direction, degrees (meteorological)
list.wind.gust Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
list.visibility Average visibility, metres. The maximum value of the visibility is 10km
list.pop Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
list.rain
list.rain.3h Rain volume for last 3 hours, mm. Please note that only mm as units of measurement are available for this parameter
list.snow
list.snow.3h Snow volume for last 3 hours. Please note that only mm as units of measurement are available for this parameter
list.sys
list.sys.pod Part of the day (n - night, d - day)
list.dt_txt Time of data forecasted, ISO, UTC
city
city.id City ID. Please note that built-in geocoder functionality has been deprecated. Learn more here
city.name City name. Please note that built-in geocoder functionality has been deprecated. Learn more here
city.coord
city.coord.lat Geo location, latitude
city.coord.lon Geo location, longitude
city.country Country code (GB, JP etc.). Please note that built-in geocoder functionality has been deprecated. Learn more here
city.population City population
city.timezone Shift in seconds from UTC
city.sunrise Sunrise time, Unix, UTC
city.sunset Sunset time, Unix, UTC
