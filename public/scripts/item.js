'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

/* WISHLIST */
async function deleteButtonClicked() {
	const wishlistItemId = this.getAttribute('data')
	const deleteResult = await fetchJSON(`/wishlist/api/delete/${wishlistItemId}`)
	if (deleteResult.success) await pageLoad()
}

function addWishlistItemContainer(item) {
	const wishlistItemName = document.createElement('h3')
	wishlistItemName.setAttribute('class', 'wishlist_item_name')
	wishlistItemName.innerText = item.name
	const wishlistItemDescription = document.createElement('p')
	wishlistItemDescription.setAttribute('class', 'wishlist_item_description')
	wishlistItemDescription.innerText = item.description
	const wishListItemContainer = document.createElement('div')
	wishListItemContainer.setAttribute('class', 'wishlist_item_container')
	wishListItemContainer.setAttribute('data', item.id)
	wishListItemContainer.appendChild(wishlistItemName)
	wishListItemContainer.appendChild(wishlistItemDescription)
	if (item.delete) wishListItemContainer.appendChild(createWishlistItemDeleteButton(item))
	document.getElementById('wishlist_container').appendChild(wishListItemContainer)
}

function createWishlistItemDeleteButton(item) {
	const wishlistDelete = document.createElement('div')
	wishlistDelete.setAttribute('class', 'wishlist_delete')
	wishlistDelete.setAttribute('data', item.id)
	wishlistDelete.onclick = deleteButtonClicked
	wishlistDelete.innerHTML = 'Delete'
	return wishlistDelete
}

async function addWishlist(itemId) {
	document.getElementById('wishlist_container').innerHTML = ''
	const wishListItems = await fetchJSON(`/wishlist/api/getItems/${itemId}`)
	if (wishListItems.length !== 0) {
		wishListItems.forEach(wishlistItem => {
			addWishlistItemContainer(wishlistItem)
		})
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = 'Empty wishlist'
		document.getElementById('wishlist_container').appendChild(text)
	}
}

/* SUGGESTIONS */
async function addSuggestions(itemId) {
	document.getElementById('suggestion_container').innerHTML = ''
	const suggestions = await fetchJSON(`/suggestion/api/itemSuggestions/${itemId}`)
	if (suggestions.length !== 0) {
		suggestions.forEach(async suggestion => await addSuggestionToDOM(suggestion))
	} else {
		const text = document.createElement('p')
		text.setAttribute('class', 'empty_filler')
		text.innerHTML = 'No suggestions'
		document.getElementById('suggestion_container').appendChild(text)
	}
}

async function addSuggestionToDOM(suggestion) {
	suggestion.item = await fetchJSON(`/item/api/itemDetails/${suggestion.item_id}`)
	suggestion.suggested_item = await fetchJSON(`/item/api/itemDetails/${suggestion.suggested_item_id}`)
	suggestion.suggested_user = await fetchJSON(`/user/api/userDetails/${suggestion.suggested_user_id}`)
	document.getElementById('suggestion_container').appendChild(createSuggestionDOMElement(suggestion))
}

function createSuggestionDOMElement(suggestion) {
	const suggestionContainer = document.createElement('div')
	suggestionContainer.setAttribute('class', 'full_width_container')
	suggestionContainer.append(createSuggestionFloatingTagDOMElement(suggestion),
		createSuggestionUserDOMElement(suggestion), createSuggestionItemDOMElement(suggestion),
		createSuggestionControlsDOMElement(suggestion))
	return suggestionContainer
}

function createSuggestionFloatingTagDOMElement(suggestion) {
	const floatingTagContainer = document.createElement('div')
	floatingTagContainer.setAttribute('class', 'floating_tag')
	floatingTagContainer.innerHTML = suggestion.item.name
	return floatingTagContainer
}

function createSuggestionUserDOMElement(suggestion) {
	const userAvatar = document.createElement('img')
	userAvatar.setAttribute('class', 'user_avatar')
	userAvatar.setAttribute('src', `/user/avatar/${suggestion.suggested_user.avatar}`)
	const userName = document.createElement('div')
	userName.setAttribute('class', 'user_name')
	userName.innerHTML = suggestion.suggested_user.name
	const userContainer = document.createElement('div')
	userContainer.setAttribute('class', 'user_container')
	userContainer.append(userAvatar, userName)
	return userContainer
}

function createSuggestionItemDOMElement(suggestion) {
	const name = document.createElement('h3')
	name.innerHTML = suggestion.suggested_item.name
	const description = document.createElement('p')
	description.innerHTML = suggestion.suggested_item.description
	const itemContainer = document.createElement('div')
	itemContainer.setAttribute('class', 'item_details')
	itemContainer.append(name, description)
	return itemContainer
}

function createSuggestionControlsDOMElement(suggestion) {
	const offerButton = document.createElement('div')
	offerButton.setAttribute('class', 'control_button control_button_green')
	offerButton.innerHTML = 'Create Offer'
	offerButton.setAttribute('data', suggestion.id)
	offerButton.onclick = suggestionOfferButtonClicked
	const removeButton = document.createElement('div')
	removeButton.setAttribute('class', 'control_button control_button_red')
	removeButton.innerHTML = 'Remove'
	removeButton.setAttribute('data', suggestion.id)
	removeButton.onclick = suggestionRemoveButtonClicked
	const controlsContainer = document.createElement('div')
	controlsContainer.setAttribute('class', 'controls')
	controlsContainer.append(offerButton, removeButton)
	return controlsContainer
}

async function suggestionOfferButtonClicked() {
	const suggestionId = this.getAttribute('data')
	const offerResult = await fetchJSON(`/suggestion/api/createOffer/${suggestionId}`)
	if (offerResult.success) await pageLoad()
}

async function suggestionRemoveButtonClicked() {
	const suggestionId = this.getAttribute('data')
	const deleteResult = await fetchJSON(`/suggestion/api/removeSuggestion/${suggestionId}`)
	if (deleteResult.success) await pageLoad()
}

/* Page Load */
const itemUrlLevelThree = 3
const itemItemId = window.location.pathname.split('/')[itemUrlLevelThree]

async function pageLoad() {
	await addWishlist(itemItemId)
	if (document.getElementById('suggestion_container') !== null) await addSuggestions(itemItemId)
}

(async() => {
	await pageLoad()
})()
