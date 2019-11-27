'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Suggestion = require('../modules/suggestion')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/suggestion')

router.get('/api/removeSuggestion/:suggestion_id', async ctx => {
	try{
		if (ctx.state.user) {
			const suggestion = await new Suggestion()
			await suggestion.remove(ctx.params.suggestion_id)
			ctx.body = {success: true}
			suggestion.tearDown()
		} else ctx.body = {success: false, message: 'Please Login'}
	} catch (error) {
		ctx.body = {success: false, message: error.message}
	}
})

router.get('/api/createOffer/:suggestion_id', async ctx => {
	try {
		if (ctx.state.user) {
			const suggestion = await new Suggestion()
			await suggestion.remove(ctx.params.suggestion_id)
			ctx.body = {success: true}
			suggestion.tearDown()
		} else ctx.body = {success: false, message: 'Please Login'}
	} catch (error) {
		ctx.body = {success: false, message: error.message}
	}
})

router.get('/api/itemSuggestions/:item_id', async ctx => {
	try {
		if (ctx.state.user) {
			const suggestion = await new Suggestion()
			ctx.body = await suggestion.getSuggestions(ctx.params.item_id)
			suggestion.tearDown()
		} else ctx.body = {success: false, message: 'Please Login'}
	} catch (error) {
		ctx.body = {success: false, message: error.message}
	}
})

module.exports = router
