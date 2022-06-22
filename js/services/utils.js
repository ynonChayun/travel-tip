export const utils = {
	makeId,
	cleanText,
}
function makeId(length = 8) {
	const possible = '0123456789QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm'
	var txt = ''
	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

function cleanText(text) {
	const regex = / {2,}/g
	const entryText = text.replaceAll(regex, ' ').trim()
	return entryText
}
