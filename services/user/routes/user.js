'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/user')

router.get('/', async ctx => {
	if (ctx.state.authenticated === true) {
		await ctx.render('user')
	} else ctx.redirect('/')
})

module.exports = router
