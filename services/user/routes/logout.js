'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/user')

router.get('/logout', async ctx => {
	if (ctx.session.authenticated === true) {
		ctx.session.authenticated = false
		ctx.session.id = undefined
	}
	ctx.redirect('/')
})

module.exports = router
