'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Item = require('../modules/item')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/item')

router.get('/api/search', async ctx => {
	const item = await new Item()
	const items = await item.getItems(ctx.query.search)
	ctx.body = items
	item.tearDown()
})

router.get('/api/myItems', async ctx => {
	if (!!ctx.state.user) {
		const item = await new Item()
		const userItemsArray = await item.getUsersItems(ctx.state.user.id)
		ctx.body = userItemsArray
		item.tearDown()
	}
})

router.get('/api/itemDetails/:item_id', async ctx => {
	if (!!ctx.state.user) {
		const item = await new Item()
		const itemDetails = await item.getDetails(ctx.params.item_id)
		ctx.body = itemDetails
		item.tearDown()
	}
})

module.exports = router
