'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Wishlist = require('../modules/wishlist')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/wishlist')

router.get('/new/:item_id', async ctx => {
	if (!!ctx.state.user) {
		await ctx.render('wishlist_item_new')
	} else ctx.redirect('/')
})

router.post('/new/:item_id', async ctx => {
	if (!!ctx.state.user) {
		const item = ctx.request.body
		item.item_id = ctx.params.item_id
		item.user_id = ctx.state.user.id
		const wishList = await new Wishlist()
		await wishList.new(item)
		ctx.redirect(`/item/details/${ctx.params.item_id}`)
		wishList.tearDown()
	} else ctx.redirect('/')
})

module.exports = router
