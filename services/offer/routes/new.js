'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Offer = require('../modules/offer')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/offer')

router.post('/new/:item_id', async ctx => {
	if (!!ctx.state.user) {
		const newOffer = {
			item: ctx.state.offer_item,
			user: ctx.state.offer_user,
			offered_item: ctx.state.offered_item,
			offered_user: ctx.state.offered_user
		}
		const offer = await new Offer()
		await offer.new(newOffer)
		ctx.redirect('/user')
		await offer.tearDown()
	} else ctx.redirect('/')
})

module.exports = router
