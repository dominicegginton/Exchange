'use strict'

const User = require('../services/user/modules/user')

const authentication = async(ctx, next) => {
	if (ctx.session.authenticated === true) {
		const userId = ctx.session.id
		const user = await new User()
		ctx.state.user = await user.getDetails(userId)
		ctx.state.authenticated = true
	} else ctx.state.authenticated = false
	await next()
}

module.exports = authentication
