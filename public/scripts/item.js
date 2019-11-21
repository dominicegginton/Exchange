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
		.removeChild(this.parentElement)
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
	if (document.getElementById('offer_offered_item') !== null) {
		const myItems = await fetchJSON('/item/api/myItems')
		myItems.forEach(myItem => {
			addMyItemsToOfferedItemSelection(myItem)
		})
	}
})()
