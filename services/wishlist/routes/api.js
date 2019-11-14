'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Wishlist = require('../modules/wishlist')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/wishlist')

router.post('/api/new/:item_id', async ctx => {
	const wishlist = await new Wishlist()
	const wishListItem = ctx.request.body
	wishListItem.item_id = ctx.params.item_id
	await wishlist.new(wishListItem)
})

router.get('/api/getItems/:item_id', async ctx => {
	const wishlist = await new Wishlist()
	const wishListItems = await wishlist.getItems(ctx.params.item_id)
	for (let i = 0; i < wishListItems.length; i++) {
		if (ctx.state.user.id === wishListItems[i].user_id) wishListItems[i].delete = true
	}
	ctx.body = wishListItems
})

router.get('/api/delete/:item_id', async ctx => {
	const wishlist = await new Wishlist()
	const deleteItem = {wishlist_item_id: ctx.params.item_id, user_id: ctx.state.user.id}
	await wishlist.delete(deleteItem)
	ctx.body = {success: true}
})

module.exports = router
