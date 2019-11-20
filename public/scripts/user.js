'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

function addMyItem(item) {
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
}

async function acceptOfferButtonClicked() {
	const offerId = this.getAttribute('data')
	const acceptResult = await fetchJSON(`/offer/api/accept/${offerId}`)
	console.log(acceptResult)
	// if (acceptResult.success) document.getElementById('my_offers')
	// 	.removeChild(this.parentElement.parentElement)
}

async function addMyOffer(offer) {
	offer.item = await fetchJSON(`/item/api/itemDetails/${offer.item_id}`)
	offer.offered_item = await fetchJSON(`/item/api/itemDetails/${offer.offered_item_id}`)
	offer.offered_user = await fetchJSON(`/user/api/userDetails/${offer.offered_user_id}`)
	document.getElementById('my_offers').appendChild(createOfferDomElement(offer))
}

function createOfferDomElement(offer) {
	const offerContainer = document.createElement('div')
	offerContainer.setAttribute('class', 'offer_container')
	offerContainer.append(createItemDomElement(offer), createOfferedUserDomElement(offer),
		createOfferedItemDomElement(offer), createOfferDeleteDomElement(offer))
	return offerContainer
}

function createItemDomElement(offer) {
	const offerItemContainer = document.createElement('div')
	offerItemContainer.setAttribute('class', 'offer_item_container')
	offerItemContainer.innerHTML = offer.item.name
	return offerItemContainer
}

function createOfferedUserDomElement(offer) {
	const offerOfferedUserAvatar = document.createElement('img')
	offerOfferedUserAvatar.setAttribute('class', 'offer_offered_user_avatar')
	offerOfferedUserAvatar.setAttribute('src', `user/avatar/${offer.offered_user.avatar}`)
	const offerOfferedUserName = document.createElement('div')
	offerOfferedUserName.setAttribute('class', 'offer_offered_user_name')
	offerOfferedUserName.innerHTML = offer.offered_user.name
	const offerOfferedUserContainer = document.createElement('div')
	offerOfferedUserContainer.setAttribute('class', 'offer_offered_user_container')
	offerOfferedUserContainer.append(offerOfferedUserAvatar, offerOfferedUserName)
	return offerOfferedUserContainer
}

function createOfferedItemDomElement(offer) {
	const offerOfferedItemName = document.createElement('h3')
	offerOfferedItemName.innerHTML = offer.offered_item.name
	const offerOfferedItemDescription = document.createElement('p')
	offerOfferedItemDescription.innerHTML = offer.offered_item.description
	const offerOfferedItemContainer = document.createElement('div')
	offerOfferedItemContainer.setAttribute('class', 'offer_offered_item_container')
	offerOfferedItemContainer.append(offerOfferedItemName, offerOfferedItemDescription)
	return offerOfferedItemContainer
}

function createOfferDeleteDomElement(offer) {
	const offerAccept = document.createElement('div')
	offerAccept.setAttribute('class', 'offer_accept')
	offerAccept.setAttribute('data', offer.id)
	offerAccept.onclick = acceptOfferButtonClicked
	offerAccept.innerHTML = 'Accept'
	return offerAccept
}


(async() => {
	const myItems = await fetchJSON('/item/api/myItems')
	myItems.forEach(item => addMyItem(item))
	const myOffers = await fetchJSON('/offer/api/myOffers')
	if (myOffers.length !== 0) {
		const myOffersHeading = document.createElement('h3')
		myOffersHeading.innerHTML = 'My Offers'
		document.getElementById('my_offers').appendChild(myOffersHeading)
		myOffers.forEach(async(offer) => addMyOffer(offer))
	}
})()
