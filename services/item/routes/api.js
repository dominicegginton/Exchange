'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Item = require('../modules/item')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/item')

router.get('/api/myItems', async ctx => {
	if (!!ctx.state.user) {
		const item = await new Item()
		const userItemsArray = await item.getUsersItems(ctx.state.user.id)
		ctx.body = userItemsArray
	}
})

router.get('/api/itemDetails/:item_id', async ctx => {
	if (!!ctx.state.user) {
		const item = await new Item()
		const itemDetilas = await item.getDetails(ctx.params.item_id)
		ctx.body = itemDetilas
	}
})

module.exports = router
