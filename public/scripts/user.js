'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

/* MY ITEMS */

async function addMyItems() {
	document.getElementById('my_items').innerHTML = ''
	const myItems = await fetchJSON('/item/api/myItems')
	if (myItems.length !== 0) {
		myItems.forEach(item => document.getElementById('my_items').appendChild(createItemDOMElement(item)))
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = 'No Items'
		document.getElementById('my_items').appendChild(text)
	}
}

function createItemDOMElement(item) {
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
	itemPreview.append(image, name, description)
	return itemPreview
}

/* MY OFFERS */

async function addMyOffers() {
	document.getElementById('my_offers').innerHTML = ''
	const myOffers = await fetchJSON('/offer/api/myOffers')
	if (myOffers.length !== 0) {
		myOffers.forEach(async offer => addMyOffer(offer))
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = 'No Offers'
		document.getElementById('my_offers').appendChild(text)
	}
}

async function addMyOffer(offer) {
	offer.item = await fetchJSON(`/item/api/itemDetails/${offer.item_id}`)
	offer.offered_item = await fetchJSON(`/item/api/itemDetails/${offer.offered_item_id}`)
	offer.offered_user = await fetchJSON(`/user/api/userDetails/${offer.offered_user_id}`)
	document.getElementById('my_offers').appendChild(createOfferDomElement(offer))
}

function createOfferDomElement(offer) {
	const offerContainer = document.createElement('div')
	offerContainer.setAttribute('class', 'full_width_container')
	offerContainer.append(createOfferedUserDomElement(offer), createItemDomElement(offer),
		createOfferedItemDomElement(offer), createOfferControlsDomElement(offer))
	return offerContainer
}

function createItemDomElement(offer) {
	const itemContainer = document.createElement('div')
	itemContainer.setAttribute('class', 'floating_tag')
	itemContainer.innerHTML = offer.item.name
	itemContainer.setAttribute('onclick', `window.location='/item/details/${offer.item_id}'`)
	return itemContainer
}

function createOfferedUserDomElement(offer) {
	const offerOfferedUserAvatar = document.createElement('img')
	offerOfferedUserAvatar.setAttribute('class', 'user_avatar')
	offerOfferedUserAvatar.setAttribute('src', `user/avatar/${offer.offered_user.avatar}`)
	const offerOfferedUserName = document.createElement('div')
	offerOfferedUserName.setAttribute('class', 'user_name')
	offerOfferedUserName.innerHTML = offer.offered_user.name
	const offerOfferedUserContainer = document.createElement('div')
	offerOfferedUserContainer.setAttribute('class', 'user_container')
	offerOfferedUserContainer.append(offerOfferedUserAvatar, offerOfferedUserName)
	return offerOfferedUserContainer
}

function createOfferedItemDomElement(offer) {
	const offerOfferedItemName = document.createElement('h3')
	offerOfferedItemName.innerHTML = offer.offered_item.name
	const offerOfferedItemDescription = document.createElement('p')
	offerOfferedItemDescription.innerHTML = offer.offered_item.description
	const offerOfferedItemContainer = document.createElement('div')
	offerOfferedItemContainer.setAttribute('class', 'item_details')
	offerOfferedItemContainer.setAttribute('onclick', `window.location='/item/details/${offer.offered_item_id}'`)
	offerOfferedItemContainer.append(offerOfferedItemName, offerOfferedItemDescription)
	return offerOfferedItemContainer
}

function createOfferControlsDomElement(offer) {
	const acceptButton = document.createElement('div')
	acceptButton.setAttribute('class', 'control_button control_button_green')
	acceptButton.innerHTML = 'Accept'
	acceptButton.setAttribute('data', offer.id)
	acceptButton.onclick = acceptOfferButtonClicked
	const rejectButton = document.createElement('div')
	rejectButton.setAttribute('class', 'control_button control_button_red')
	rejectButton.innerHTML = 'Reject'
	rejectButton.setAttribute('data', offer.id)
	rejectButton.onclick = rejectOfferButtonClicked
	const controlsContainer = document.createElement('div')
	controlsContainer.setAttribute('class', 'controls')
	controlsContainer.append(acceptButton, rejectButton)
	return controlsContainer
}

async function acceptOfferButtonClicked() {
	const offerId = this.getAttribute('data')
	const acceptResult = await fetchJSON(`/offer/api/accept/${offerId}`)
	console.log(acceptResult)
	// if (acceptResult.success) document.getElementById('my_offers')
	// 	.removeChild(this.parentElement.parentElement)
}

async function rejectOfferButtonClicked() {
	const offerId = this.getAttribute('data')
	const response = await fetchJSON(`/offer/api/reject/${offerId}`)
	if (response.success) pageLoad()
}

/* PAGE LOAD */

async function pageLoad() {
	await addMyItems()
	await addMyOffers()
}

(async() => {
	await pageLoad()
})()
