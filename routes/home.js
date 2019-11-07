'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const User = require('../services/user/modules/user')

/* SETUP ROUTER */
const router = new Router()

router.get('/', async ctx => {
	if (ctx.session.authenticated === true) {
		const user = await new User()
		const userDetails = await user.getDetails(ctx.session.id)
		await ctx.render('home', {user: userDetails})
	} else await ctx.render('home')
})

module.exports = router
