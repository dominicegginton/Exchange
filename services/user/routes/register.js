'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const User = require('../modules/user')

/* SETUP ROUTER */
const router = new Router()

router.get('/register', async ctx => {
	await ctx.render('register')
})

router.post('/register', async ctx => {
	try {
		const newUser = ctx.request.body
		const newUserAvatar = ctx.request.files.avatar
		const user = await new User()
		const newUserID = await user.register(newUser)
		await user.uploadAvatar(newUserID, newUserAvatar)
		await ctx.redirect('/login')
	} catch (error) {
		await ctx.render('register', {error: error})
	}
})

module.exports = router
