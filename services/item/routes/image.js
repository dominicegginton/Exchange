'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const FileSystem = require('fs-extra')

/* SETUP ROUTER */
const router = new Router()

router.get('/image/:fileName', ctx => {
	const fileName = ctx.params.fileName
	if(FileSystem.existsSync(`./data/images/${fileName}`)) {
		const avatar = FileSystem.createReadStream(`./data/images/${fileName}`)
		ctx.body = avatar
	} else ctx.redirect('/media/image.png')
})

module.exports = router
