'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Item = require('../modules/item')

/* SETUP ROUTER */
const router = new Router()

router.get('/item/new', async ctx => {
	if (!!ctx.state.user) {
		await ctx.render('newItem')
	} else ctx.redirect('/')
})

router.post('/item/new', async ctx => {
	if (!!ctx.state.user) {
		const newItem = ctx.request.body
		newItem.userId = ctx.state.user.id
		const newItemImage = ctx.request.files.image
		const item = await new Item()
		const newItemId = await item.new(newItem)
		await item.uploadImage(newItemId, newItemImage)
		ctx.redirect('/user')
	} else ctx.redirect('/')
})

module.exports = router
