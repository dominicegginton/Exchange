'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const User = require('../modules/user')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/user')

router.get('/api/userDetails/:user_id', async ctx => {
	if (!!ctx.state.user) {
		const user = await new User()
		const userDetails = await user.getDetails(ctx.params.user_id)
		ctx.body = userDetails
	}
})

module.exports = router
