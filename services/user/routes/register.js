'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const User = require('../modules/user')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/user')

router.get('/register', async ctx => {
	await ctx.render('register')
})

router.post('/register', async ctx => {
	const user = await new User()
	try {
		const newUser = ctx.request.body
		const newUserAvatar = ctx.request.files.avatar
		const newUserID = await user.register(newUser)
		await user.uploadAvatar(newUserID, newUserAvatar)
		await ctx.redirect('/user/login')
	} catch (error) {
		await ctx.render('register', {error: error})
	} finally {
		await user.tearDown()
	}
})

module.exports = router
