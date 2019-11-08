'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')

/* SETUP ROUTER */
const router = new Router()

router.get('/', async ctx => {
	if (ctx.state.authenticated === true) {
		await ctx.render('home')
	} else await ctx.render('home')
})

module.exports = router
