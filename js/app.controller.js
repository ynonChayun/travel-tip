import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onCopyLoc = onCopyLoc

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
	console.log('Getting Pos')
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	})
}

function onAddMarker(ev) {
	if (!ev) mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
	var lat = ev.latLng.lat()
	var lng = ev.latLng.lng()
	mapService.addMarker({ lat: lat, lng: lng })
}

function onGetUserPos() {
	getPosition()
		.then((pos) => {
			console.log('User position is:', pos.coords)
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
	navigator.clipboard.writeText(urlWithLoc);
}

// function renderLocs() {
// 	const locs = getLocs()
// 	const strHTML = getLocs.map(() =>)
// }
