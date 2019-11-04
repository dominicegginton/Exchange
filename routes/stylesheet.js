'use strict'

/* IMPORT MODULES */
const Router = require('koa-router')
const Sass = require('node-sass')

/* SETUP ROUTER */
const router = new Router()

router.get('/stylesheet/:fileName', async ctx => {
	ctx.body = Sass.renderSync({file: `./sass/${ctx.params.fileName}.sass`}).css
})

module.exports = router
