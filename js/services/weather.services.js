export const wetherService = {
	getWetherSps,
}
let gCurrWeather = {}

function getWetherSps(data) {
	console.log('data:', data)
	gCurrWeather.icon = data.weather[0].icon
	gCurrWeather.name = data.name
	gCurrWeather.feels_like = Math.round(Number(data.main.feels_like)) / 10
	gCurrWeather.humidity = data.main.humidity
	gCurrWeather.pressure = data.main.pressure
	gCurrWeather.temp = Math.round(Number(data.main.temp)) / 10
	gCurrWeather.temp_max = Math.round(Number(data.main.temp_max)) / 10
	gCurrWeather.temp_min = Math.round(Number(data.main.temp_min)) / 10
	console.log('gCurrWeather:', gCurrWeather)
	return gCurrWeather
}
