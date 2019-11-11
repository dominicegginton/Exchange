'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const FileSystem = require('fs-extra')

/* SETUP ROUTER */
const router = new Router()
router.prefix('/user')

router.get('/avatar/:fileName', ctx => {
	const fileName = ctx.params.fileName
	if(FileSystem.existsSync(`./data/avatars/${fileName}`)) {
		const avatar = FileSystem.createReadStream(`./data/avatars/${fileName}`)
		ctx.body = avatar
	} else ctx.redirect('/media/avatar.svg')
})

module.exports = router
