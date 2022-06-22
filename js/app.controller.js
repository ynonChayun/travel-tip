import {locService} from './services/loc.service.js'

import {wetherService} from './services/weather.services.js'
import {mapService} from './services/map.service.js'
import {utils} from './services/utils.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onCopyLoc = onCopyLoc
window.onDeleteBtn = onDeleteBtn
window.OnGetLocation = OnGetLocation

function onInit() {
	mapService
		.initMap()
		.then(() => {
			// getWether()
			onGetWether()
			console.log('Map is ready')
		})
		.catch(() => console.log('Error: cannot init map'))
	renderLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	})
}

function onAddMarker(ev) {
	if (!ev) mapService.addMarker({lat: 32.0749831, lng: 34.9120554})
	const title = prompt('title') // switch with modal
	console.log('ev:', ev)
	var lat = ev.latLng.lat()
	var lng = ev.latLng.lng()
	locService.saveLocation({lat, lng}, title)
	mapService.addMarker({lat, lng}, title)
}

function onGetUserPos() {
	getPosition()
		.then((pos) => {
			console.log('pos:', pos)
			mapService.showLocation(pos)
			document.querySelector(
				'.user-pos'
			).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
		})
		.catch((err) => {
			console.log('err!!!', err)
		})
}

function onPanTo() {
	console.log('Panning the Map')
	mapService.panTo(35.6895, 139.6917)
}

function onCopyLoc() {
	const urlWithLoc = `https://ynonchayun.github.io/travel-tip/index.html?lat=${3.14}&lng=${1.13}`
	navigator.clipboard.writeText(urlWithLoc)
}

function renderLocs() {
	const locs = locService.getSetLocs()
	const strHeaderHTML = `<h1 class='locations-header' >My locations</h1>`
	const strsHTML = locs.map(
		(loc) => `<div class="location">
	<div class="loc-title">${loc.name}</div>
	<div class="loc-details">📍 ${loc.lat}, ${loc.lng} 🕛 2.33</div>
	<div class="buttons">
		<button class="delete-btn" onclick="onDeleteBtn('${loc.id}')">🗑️</button>
		<button class="go-btn" onclick="onGoBtn('${loc.id}')">GO</button>
	</div>
</div>`
	)
	document.querySelector('.locations').innerHTML = strHeaderHTML + strsHTML.join('')
}

function onDeleteBtn(id) {
	locService.deleteLoc(id)
	renderLocs()
}
function OnGetLocation(value) {
	getCoords(value)
}
function displayPos() {
	const currPos = locService.getSetCurrentPos()

	document.querySelector('.user-pos').innerText = ` ${currPos.title}`

	let pos = {coords: {longitude: currPos.lon, latitude: currPos.lat}}
	mapService.showLocation(pos)
	getWether()
}

function getCoords(address) {
	let txt = utils.cleanText(address)
	var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q=' + txt
	fetch(url)
		.then((response) => response.json())
		.then((data) => locService.getAddress(data))
		.then((res) => displayPos(res))

		.catch((err) => console.log(err))
}

function onGetWether() {
	getPosition()
		.then((pos) => {
			console.log('pos:', pos)
			let x = locService.getSetCurrentPos(pos)
			let lan = x.coords.latitude
			let lng = x.coords.longitude
			getWether({lan, lng})
		})
		.catch((err) => {
			console.log('err!!!', err)
		})
}

function getWether(pos) {
	if (!pos) pos = locService.getWetherCoords()
	console.log('pos:', pos)

	const API = 'f811e21a69624c25599c2622bf4d98fe'
	var url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.lan}&lon=${pos.lng}&appid=${API}`
	fetch(url)
		.then((response) => response.json())
		.then((data) => wetherService.getWetherSps(data))
		.then((res) => renderWether(res))

		.catch((err) => console.log(err))
}

function renderWether(res) {
	document.querySelector('.weather').innerHTML = `
	<table class="unstyledTable">
<thead>
<tr>
<th>${res.name}</th>
<th><div class="i"></div></th>
</tr>
</thead>
<tbody>
<td>Temp</td><td>${res.temp}°</td></tr>
<tr>
<td>Feels like</td><td>${res.feels_like}°</td></tr>
<tr>
<td>Max temp</td><td>${res.temp_max}°</td></tr>
<tr>
<td>Min temp</td><td>${res.temp_min}°</td></tr>
<tr>
<td>Humidity</td><td>${res.humidity}</td></tr>
<tr>
<td>Pressure</td><td>${res.pressure}</td></tr>
</tbody>
</tr>
</table>
	`

	translateIcon(res.icon)
}

function translateIcon(icon) {
	const i = document.querySelector('.i')
	const firstTwoChars = icon.slice(0, 2)
	const lastChar = icon.slice(2)
	switch (firstTwoChars) {
		case '01':
			if (lastChar === 'd') {
				i.classList.add('far', 'fa-sun')
			} else {
				i.classList.add('far', 'fa-moon')
			}
			break
		case '02':
			if (lastChar === 'd') {
				i.classList.add('fas', 'fa-cloud-sun')
			} else {
				i.classList.add('fas', 'fa-cloud-moon')
			}
			break
		case '03':
			i.classList.add('fas', 'fa-cloud')
			break
		case '04':
			i.classList.add('fas', 'fa-cloud-meatball')
			break
		case '09':
			i.classList.add('fas', 'fa-cloud-rain')
			break
		case '10':
			if (lastChar === 'd') {
				i.classList.add('fas', 'fa-cloud-sun-rain')
			} else {
				i.classList.add('fas', 'fa-cloud-moon-rain')
			}
			break
		case '11':
			i.classList.add('fas', 'fa-poo-storm')
			break
		case '13':
			i.classList.add('far', 'fa-snowflake')
			break
		case '50':
			i.classList.add('fas', 'fa-smog')
			break
		default:
			i.classList.add('far', 'fa-question-circle')
	}
	return i
}
