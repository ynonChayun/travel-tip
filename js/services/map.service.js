export const mapService = {
	initMap,
	addMarker,
	panTo,
	getSetMap,
	showLocation,
}
import {storageService} from './storage.service.js'

var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
	return _connectGoogleApi().then(() => {
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: {lat, lng},
			zoom: 15,
		})
		gMap.addListener('click', (e) => {
			onAddMarker(e)
		})
	})
}

function addMarker(loc, title) {
	var marker = new google.maps.Marker({
		position: loc,
		map: gMap,
		title,
	})
	storageService.saveToStorage
	return marker
}

function panTo(lat, lng) {
	var laLatLng = new google.maps.LatLng(lat, lng)
	gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
	if (window.google) return Promise.resolve()
	const API_KEY = 'AIzaSyCcVLpCGImKVzegQUyoOyLjparIn2jsSpA'
	var elGoogleApi = document.createElement('script')
	elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
	elGoogleApi.async = true
	document.body.append(elGoogleApi)

	return new Promise((resolve, reject) => {
		elGoogleApi.onload = resolve
		elGoogleApi.onerror = () => reject('Google script failed to load')
	})
}

function getSetMap(map) {
	if (!map) return gMap
	gMap = map
	return gMap
}
function showLocation(pos) {
	console.log('pos:', pos)
	const lat = pos.coords.latitude
	const lng = pos.coords.longitude

	const position = {lat, lng}
	gMap.setCenter(position)
}

// const myCoordsObj = {
//   lat: coordsData.coord.lat,
//   lon: coordsData.coord.lon,
//   name: coordsData.sys.country
//     ? `${coordsData.name}, ${coordsData.sys.country}`
//     : coordsData.name
// };
