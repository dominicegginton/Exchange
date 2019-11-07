'use strict'

// eslint-disable-next-line no-unused-vars
function subFileName(obj) {
	const file = obj.value
	const fileName = file.split('\\')
	document.getElementById('fileName').innerHTML = fileName[fileName.length - 1]
}
