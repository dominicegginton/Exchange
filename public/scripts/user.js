'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

/* AJAX - MY ITEMS */
(async() => {
	const myItems = await fetchJSON('/item/api/myItems')
	myItems.forEach(item => {
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
		document.getElementById('my_items').appendChild(itemPreview)
	})
})()
