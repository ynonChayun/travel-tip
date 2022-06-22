export const locService = {
	saveLocation,
	getSetLocs,
	deleteLoc,
	getAddress,
	getSetCurrentPos,
	getWetherCoords,
}
import {storageService} from './storage.service.js'
import {utils} from './utils.js'
import {wetherService} from './weather.services.js'
const LOCATION_KEY = 'locationsDB'
let gCurrentPosition
const gLocs = [
	{name: 'Greatplace', lat: 32.047104, lng: 34.832384, id: utils.makeId()},
	{name: 'Neveragain', lat: 32.047201, lng: 34.832581, id: utils.makeId()},
]

function saveLocation(loc, title) {
	const location = {
		name: title,
		lat: loc.lat,
		lng: loc.lng,
		id: utils.makeId(),
	}
	gLocs.push(location)
	storageService.saveToStorage(LOCATION_KEY, gLocs)
}

function getSetLocs(locs) {
	if (!locs) return gLocs
	gLocs = locs
}

function deleteLoc(id) {
	const locIdx = gLocs.findIndex((loc) => loc.id === id)
	gLocs.splice(locIdx, 1)
}
function getAddress(data) {
	const lat = data[0].lat
	const lon = data[0].lon
	const title = data[0].display_name
	gCurrentPosition = {lat, lon, title}
}

function getSetCurrentPos(pos) {
	if (!pos) return gCurrentPosition
	gCurrentPosition = pos
	return gCurrentPosition
}
function getWetherCoords() {
	const lan = gCurrentPosition.lat
	const lng = gCurrentPosition.lng
	return {lan, lng}
}
