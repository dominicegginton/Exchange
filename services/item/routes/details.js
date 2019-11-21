'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Item = require('../modules/item')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/item')

router.get('/details/:item_id', async ctx => {
	if (!!ctx.state.user) {
		const item = await new Item()
		const itemDetails = await item.getDetails(ctx.params.item_id)
		await ctx.render('item', {item: itemDetails})
	} else ctx.redirect('/')
})

module.exports = router
