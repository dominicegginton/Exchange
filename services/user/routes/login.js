'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const User = require('../modules/user')

/* SETUP ROUTER */
const router = new Router()

router.get('/login', async ctx => {
	if (ctx.session.authenticated === true) ctx.redirect('/')
	else await ctx.render('login')
})

module.exports = router
