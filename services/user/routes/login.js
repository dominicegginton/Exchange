'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const User = require('../modules/user')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/user')

router.get('/login', async ctx => {
	if (ctx.state.authenticated === true) ctx.redirect('/')
	else await ctx.render('login')
})

router.post('/login', async ctx => {
	const user = await new User()
	try {
		const userDetails = ctx.request.body
		const userId = await user.login(userDetails)
		ctx.session.authenticated = true
		ctx.session.id = userId
		ctx.redirect('/')
	} catch (error) {
		await ctx.render('login', {error: error})
	} finally {
		await user.tearDown()
	}
})

module.exports = router
