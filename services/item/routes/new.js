'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Item = require('../modules/item')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/item')

router.get('/new', async ctx => {
	if (!!ctx.state.user) {
		await ctx.render('item_new')
	} else ctx.redirect('/')
})

router.post('/new', async ctx => {
	if (!!ctx.state.user) {
		const newItem = ctx.request.body
		newItem.user_id = ctx.state.user.id
		const newItemImage = ctx.request.files.image
		const item = await new Item()
		const newItemId = await item.new(newItem)
		await item.uploadImage(newItemId, newItemImage)
		ctx.redirect(`/item/details/${newItemId}`)
	} else ctx.redirect('/')
})

module.exports = router
