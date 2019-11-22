'use strict'

/* IMPORT MODULES */
const User = require('../services/user/modules/user')
const Item = require('../services/item/modules/item')

const serviceLevel = 1
const actionLevel = 2
const idLevel = 3

const offer = async(ctx, next) => {
	if (ctx.state.user) {
		const urlArray = ctx.request.url.split('/')
		if (urlArray[serviceLevel] === 'offer') {
			if (urlArray[actionLevel] === 'new' && ctx.request.method === 'POST') {
				const item = await new Item()
				const user = await new User()
				ctx.state.offer_item = await item.getDetails(urlArray[idLevel])
				ctx.state.offer_user = await user.getDetails(ctx.state.offer_item.user_id)
				ctx.state.offered_item = await item.getDetails(ctx.request.body.offered_item_id)
				ctx.state.offered_user= await user.getDetails(ctx.state.offered_item.user_id)
				await user.tearDown()
				await item.tearDown()
			}
		}
		await next()
	} else await next()
}

module.exports = offer
