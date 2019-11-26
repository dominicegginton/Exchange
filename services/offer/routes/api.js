'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Offer = require('../modules/offer')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/offer')

router.get('/api/myOffers', async ctx => {
	if (!!ctx.state.user) {
		const offer = await new Offer()
		const myOffers = await offer.getUsersReceivedOffers(ctx.state.user.id)
		ctx.body = myOffers
		await offer.tearDown()
	} else ctx.redirect('/')
})

router.get('/api/new/:item_id', async ctx => {
	try {
		if (!!ctx.state.user) {
			const newOffer = {
				item: ctx.state.offer_item,
				user: ctx.state.offer_user,
				offered_item: ctx.state.offered_item,
				offered_user: ctx.state.offered_user
			}
			const offer = await new Offer()
			await offer.new(newOffer)
			ctx.body = {success: true}
			await offer.tearDown()
		}
	} catch (error) {
		ctx.body = {success: false, message: error.message}
	}
})

module.exports = router
