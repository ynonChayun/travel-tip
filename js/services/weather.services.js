export const wetherService = {
	getWetherSps,
}
let gCurrWeather = {}

function getWetherSps(data) {
	console.log('data:', data)
	gCurrWeather.feels_like = data.main.feels_like / 10
	gCurrWeather.humidity = data.main.humidity
	gCurrWeather.pressure = data.main.pressure
	gCurrWeather.temp = data.main.temp / 10
	gCurrWeather.temp_max = data.main.temp_max / 10
	gCurrWeather.temp_min = data.main.temp_min / 10
	return gCurrWeather
}
