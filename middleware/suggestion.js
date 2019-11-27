'use strict'

/* IMPORT MODULES */
const Compose = require('koa-compose')
const User = require('../services/user/modules/user')
const Item = require('../services/item/modules/item')
const Wishlist = require('../services/wishlist/modules/wishlist')
const Offer = require('../services/offer/modules/offer')
const Suggestion = require('../services/suggestion/modules/suggestion')

const urlLevelThree = 3
const urlLevelFour = 4

async function calcWishlistSuggestions(wishlistItem, itemDetails) {
	const [item, wishlist, suggestion, user] = [await new Item(), await new Wishlist(),
		await new Suggestion(), await new User()]
	wishlistItem.matches = await item.getItems(`${wishlistItem.name}`)
	wishlistItem.matches.forEach(async matchItem => {
		matchItem.wishlist = await wishlist.getItems(matchItem.id)
		matchItem.wishlist.forEach(async matchWishlist => {
			matchWishlist.matches = await item.getItems(matchWishlist.name)
			matchWishlist.matches.forEach(async suggestedItem => {
				if (suggestedItem.id === itemDetails.id) {
					await suggestion.new({item: itemDetails, wishlist_item: wishlistItem,
						user: await user.getDetails(itemDetails.user_id), suggested_item: matchItem,
						suggested_wishlist_item: matchWishlist,
						suggested_user: await user.getDetails(matchItem.user_id)})
				}
			})
		})
	})
	user.tearDown(), item.tearDown(), wishlist.tearDown(), suggestion.tearDown()
}

async function calcItemSuggestions(itemId) {
	const [item, wishlist] = [await new Item(), await new Wishlist()]
	const itemDetails = await item.getDetails(itemId)
	itemDetails.wishlist = await wishlist.getItems(itemDetails.id)
	itemDetails.wishlist.forEach(async wishlistItem => await calcWishlistSuggestions(wishlistItem, itemDetails))
	item.tearDown(), wishlist.tearDown()
}

async function createNewOffer(suggestionId, userId) {
	try {
		const [item, suggestion, user, offer] = [await new Item(), await new Suggestion(),
			await new User(), await new Offer()]
		const details = await suggestion.getDetails(suggestionId)
		if (userId === details.suggested_user_id) {
			[details['item_id'], details['suggested_item_id']] = [details['suggested_item_id'], details['item_id']],
			[details['user_id'], details['suggested_user_id']] = [details['suggested_user_id'], details['user_id']]
		}
		const newOffer = { item: await item.getDetails(details.suggested_item_id),
			user: await user.getDetails(details.suggested_user_id),
			offered_item: await item.getDetails(details.item_id),
			offered_user: await user.getDetails(details.user_id) }
		await offer.new(newOffer)
	} catch (error) {
		throw error
	}
}

const wishlistNew = async(ctx, next) => {
	const url = ctx.request.url.split('/')
	if (ctx.state.user && ctx.request.url.startsWith('/wishlist/new/')) {
		await next()
		const itemId = url[urlLevelThree]
		calcItemSuggestions(itemId)
	} else await next()
}

const wishlistDelete = async(ctx, next) => {
	const url = ctx.request.url.split('/')
	if (ctx.state.user && ctx.request.url.startsWith('/wishlist/api/delete/')) {
		await next()
		const wishlistId = url[urlLevelFour]
		const suggestion = await new Suggestion()
		await suggestion.delete(wishlistId)
		suggestion.tearDown()
	} else await next()
}

const suggestionCreateOffer = async(ctx, next) => {
	const url = ctx.request.url.split('/')
	if (ctx.state.user && ctx.request.url.startsWith('/suggestion/api/createOffer/')) {
		const suggestionId = url[urlLevelFour]
		await createNewOffer(suggestionId, ctx.state.user.id)
		const suggestion = await new Suggestion()
		await suggestion.remove(suggestionId)
		suggestion.tearDown()
		ctx.body = {success: true}
		next()
	} else await next()
}

module.exports = Compose([suggestionCreateOffer, wishlistDelete, wishlistNew])
