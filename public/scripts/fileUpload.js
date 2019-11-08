'use strict'

function subFileName() {
	const file = this.value
	const fileName = file.split('\\')
	document.getElementById('fileName').innerHTML = fileName[fileName.length - 1]
}

document.getElementById('file').onchange = subFileName
