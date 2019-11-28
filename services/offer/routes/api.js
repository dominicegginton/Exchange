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

router.get('/api/reject/:offer_id', async ctx => {
	const offer = await new Offer()
	try {
		if (!!ctx.state.user) {
			await offer.reject(ctx.params.offer_id)
			ctx.body = {success: true}
		}
	} catch (error) {
		ctx.body = {success: false, message: error.message}
	} finally {
		await offer.tearDown()
	}
})

router.get('/api/new/:item_id', async ctx => {
	const offer = await new Offer()
	try {
		if (!!ctx.state.user) {
			const newOffer = {
				item: ctx.state.offer_item,
				user: ctx.state.offer_user,
				offered_item: ctx.state.offered_item,
				offered_user: ctx.state.offered_user
			}
			await offer.new(newOffer)
			ctx.body = {success: true}
		}
	} catch (error) {
		ctx.body = {success: false, message: error.message}
	} finally {
		await offer.tearDown()
	}
})

module.exports = router
