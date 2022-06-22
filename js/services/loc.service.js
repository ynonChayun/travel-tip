export const locService = {
	getLocs,
	saveLocation,
	getSetLocs,
}
import {storageService} from './storage.service.js'
import {utils} from './utils.js'
const LOCATION_KEY = 'locationsDB'

const gLocs = [
	{name: 'Greatplace', lat: 32.047104, lng: 34.832384, id: utils.makeId()},
	{name: 'Neveragain', lat: 32.047201, lng: 34.832581, id: utils.makeId()},
]

function saveLocation(loc, title) {
	const currentLocation = {
		name: title,
		lat: loc.lat,
		lng: loc.lng,
		id: utils.makeId(),
	}
	gLocs.push(currentLocation)
	storageService.saveToStorage(LOCATION_KEY, gLocs)
}

function getSetLocs(locs) {
	if (!locs) return gLocs
	gLocs = locs
}

function getLocs() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(gLocs)
		}, 2000)
	})
}
