import {locService} from './services/loc.service.js'
import {mapService} from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onCopyLoc = onCopyLoc
window.onDeleteBtn = onDeleteBtn

function onInit() {
	mapService
		.initMap()
		.then(() => {
			console.log('Map is ready')
		})
		.catch(() => console.log('Error: cannot init map'))
	// renderLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	})
}

function onAddMarker(ev) {
	if (!ev) mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
	const title = prompt('title') // switch with modal
	console.log('ev:', ev)
	var lat = ev.latLng.lat()
	var lng = ev.latLng.lng()
	locService.saveLocation({ lat, lng }, title)
	mapService.addMarker({ lat, lng }, title)
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
	const strsHTML = locs.map(loc => `<div class="location">
	<div class="loc-title">${loc.name}</div>
	<div class="loc-details">📍 ${loc.lat}, ${loc.lng} 🕛 2.33</div>
	<div class="buttons">
		<button class="delete-btn" onclick="onDeleteBtn('${loc.id}')">🗑️</button>
		<button class="go-btn" onclick="onGoBtn('${loc.id}')">GO</button>
	</div>
</div>`)
	document.querySelector('.locations').innerHTML = strHeaderHTML + strsHTML.join('')
}

function onDeleteBtn(id) {
	locService.deleteLoc(id)
	renderLocs()
}
