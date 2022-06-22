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
	onGetWether()
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
	getWether()
}

function getWether() {
	let pos = locService.getWetherCoords()

	const API = 'f811e21a69624c25599c2622bf4d98fe'
	var url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.lan}&lon=${pos.lng}&appid=${API}`
	fetch(url)
		.then((response) => response.json())
		.then((data) => wetherService.getWetherSps(data))
		.then((res) => renderWether(res))

		.catch((err) => console.log(err))
}
function renderWether(res) {
	console.log('res:', res)
}
// feels_like: 29.841
// humidity: 83
// pressure: 1006
// temp: 29.773000000000003
// temp_max: 29.816000000000003
// temp_min: 29.716
