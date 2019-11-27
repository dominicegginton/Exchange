'use strict'

/* IMPORT MODULES */
const User = require('../services/user/modules/user')
const Item = require('../services/item/modules/item')

const urlLevelFour = 4

const offer = async(ctx, next) => {
	if (ctx.state.user && ctx.request.url.startsWith('/offer/api/new/')) {
		const urlArray = ctx.request.url.split('/')
		const item = await new Item()
		const user = await new User()
		ctx.state.offer_item = await item.getDetails(urlArray[urlLevelFour].split('?')[0])
		ctx.state.offer_user = await user.getDetails(ctx.state.offer_item.user_id)
		ctx.state.offered_item = await item.getDetails(ctx.request.query.offered_item_id)
		ctx.state.offered_user= await user.getDetails(ctx.state.offered_item.user_id)
		await user.tearDown()
		await item.tearDown()
		await next()
	} else await next()
}

module.exports = offer
