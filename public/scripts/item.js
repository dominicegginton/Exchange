'use strict'

async function fetchJSON(url) {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

async function deleteButtonClicked() {
	const wishlistItemId = this.getAttribute('data')
	const deleteResult = await fetchJSON(`/wishlist/api/delete/${wishlistItemId}`)
	if (deleteResult.success) document.getElementById('wishlist_container')
		.removeChild(this.parentElement.parentElement)
}

function addWishlistItemContainer(item) {
	const wishlistItemName = document.createElement('h3')
	wishlistItemName.setAttribute('class', 'wishlist_item_name')
	wishlistItemName.innerText = item.name
	const inlineHeadingButton = document.createElement('div')
	inlineHeadingButton.setAttribute('class', 'inline_header_button')
	inlineHeadingButton.appendChild(wishlistItemName)
	const wishlistItemDescription = document.createElement('p')
	wishlistItemDescription.setAttribute('class', 'wishlist_item_description')
	wishlistItemDescription.innerText = item.description
	const wishListItemContainer = document.createElement('div')
	wishListItemContainer.setAttribute('class', 'wishlist_item_container')
	wishListItemContainer.setAttribute('data', item.id)
	wishListItemContainer.appendChild(inlineHeadingButton)
	wishListItemContainer.appendChild(wishlistItemDescription)
	document.getElementById('wishlist_container').appendChild(wishListItemContainer)
	if (item.delete) addWishlistItemDeleteButton(wishListItemContainer)
}

function addWishlistItemDeleteButton(wishlistItemContainer) {
	const separator = document.createElement('div')
	separator.setAttribute('class', 'separator')
	const deleteButton = document.createElement('div')
	deleteButton.setAttribute('class', 'wishlist_item_delete_button')
	deleteButton.setAttribute('data', wishlistItemContainer.getAttribute('data'))
	deleteButton.onclick = deleteButtonClicked
	const deleteText = document.createElement('p')
	deleteText.innerHTML = 'Delete'
	deleteButton.appendChild(deleteText)
	const inlineHeadingButton = wishlistItemContainer.getElementsByClassName('inline_header_button')
	inlineHeadingButton[0].appendChild(separator)
	inlineHeadingButton[0].appendChild(deleteButton)
}

function addMyItemsToOfferedItemSelection(myItem) {
	const selection = document.getElementById('offer_offered_item')
	const option = document.createElement('option')
	option.setAttribute('value', myItem.id)
	option.innerHTML = myItem.name
	selection.appendChild(option)
}

(async() => {
	const windowLocationPathnameLocation = 3
	const itemId = window.location.pathname.split('/')[windowLocationPathnameLocation]
	const wishListItems = await fetchJSON(`/wishlist/api/getItems/${itemId}`)
	wishListItems.forEach(wishlistItem => {
		addWishlistItemContainer(wishlistItem)
	})
	const myItems = await fetchJSON('/item/api/myItems')
	myItems.forEach(myItem => {
		addMyItemsToOfferedItemSelection(myItem)
	})
})()
