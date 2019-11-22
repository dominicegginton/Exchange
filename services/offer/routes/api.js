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

module.exports = router
