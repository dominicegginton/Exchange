'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')

/* SETUP ROUTER */
const router = new Router()

router.get('/', async ctx => {
	await ctx.render('home')
})

module.exports = router
