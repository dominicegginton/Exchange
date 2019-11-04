'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')

/* SETUP ROUTER */
const router = new Router()

router.get('/register', async ctx => {
	await ctx.render('register')
})

module.exports = router
