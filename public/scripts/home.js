'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

async function search() {
	document.getElementById('items').innerHTML = ''
	const searchText = document.getElementById('search')['search'].value
	const items = await fetchJSON(`/item/api/search?search=${searchText}`)
	if (items.length !== 0) {
		items.forEach(item => addItem(item))
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = 'No Items'
		document.getElementById('items').appendChild(text)
	}
	return false
}

function addItem(item) {
	const name = document.createElement('p')
	name.setAttribute('class', 'item_preview_name')
	name.innerText = item.name
	const image = document.createElement('img')
	image.setAttribute('src', `/item/image/${item.image}`)
	const description = document.createElement('p')
	description.setAttribute('class', 'item_preview_description')
	description.innerText = item.description
	const itemPreview = document.createElement('div')
	itemPreview.setAttribute('class', 'item_preview_container')
	itemPreview.setAttribute('onclick', `window.location='/item/details/${item.id}'`)
	itemPreview.appendChild(image)
	itemPreview.appendChild(name)
	itemPreview.appendChild(description)
	document.getElementById('items').appendChild(itemPreview)
}

document.getElementById('search').onsubmit = () => {
	search()
	return false
}

document.getElementById('search')['search'].onkeyup = () => {
	const object = document.getElementById('search')['search']
	const value = object.value
	if (value !== '') object.classList.add('searchbox_valid')
	else object.classList.remove('searchbox_valid')
}

(async() => {
	search()
})()
