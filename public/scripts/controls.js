'use strict'

function updateFileName() {
	const file = this.value
	const fileName = file.split('\\')
	document.getElementById('file_name').innerHTML = fileName[fileName.length - 1]
}

document.getElementById('file').onchange = updateFileName
