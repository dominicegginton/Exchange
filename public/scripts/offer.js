'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

/* NEW OFFER */
async function createOffer() {
	const offeredItemId = document.getElementById('offer_form')['offered_item'].value
	const response = await fetchJSON(`/offer/api/new/${itemId}?offered_item_id=${offeredItemId}`)
	document.getElementById('offer_form_container').innerHTML = ''
	if (response.success ) {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.setAttribute('id', 'response')
		text.innerHTML = 'Offer Sent'
		document.getElementById('offer_form_container').appendChild(text)
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = response.message
		document.getElementById('offer_form_container').appendChild(text)
	}
	return false
}

function createOfferItemSelectionDOMElement(myItems) {
	const itemSelection = document.createElement('select')
	itemSelection.setAttribute('name', 'offered_item')
	myItems.forEach(item => {
		const option = document.createElement('option')
		option.setAttribute('value', item.id)
		option.innerHTML = item.name
		itemSelection.appendChild(option)
	})
	return itemSelection
}

function createOfferFormDOMElement(myItems) {
	const groupItem = document.createElement('div')
	groupItem.setAttribute('class', 'group')
	groupItem.appendChild(createOfferItemSelectionDOMElement(myItems))
	const offerButton = document.createElement('button')
	offerButton.setAttribute('class', 'button')
	offerButton.setAttribute('type', 'submit')
	offerButton.onclick = createOffer
	offerButton.innerHTML = 'Offer'
	const groupButton = document.createElement('div')
	groupButton.setAttribute('class', 'group')
	groupButton.appendChild(offerButton)
	const form = document.createElement('form')
	form.setAttribute('id', 'offer_form')
	form.setAttribute('onsubmit', 'return false;')
	form.append(groupItem, groupButton)
	return form
}

async function addOfferedItems() {
	document.getElementById('offer_form_container').innerHTML = ''
	const myItems = await fetchJSON('/item/api/myItems')
	if (myItems.length !== 0) {
		document.getElementById('offer_form_container').appendChild(createOfferFormDOMElement(myItems))
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = 'You have no items to offer'
		document.getElementById('offer_form_container').appendChild(text)
	}
}

/* Page Load */
const urlLevelThree = 3
const itemId = window.location.pathname.split('/')[urlLevelThree]

async function pageLoad() {
	if (document.getElementById('offer_form_container') !== null) await addOfferedItems()
}

(async() => {
	await pageLoad()
})()
