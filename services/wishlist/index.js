'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const newRouter = require('./routes/new')
const apiRouter = require('./routes/api')

/* COMPOSE ROUTERS */
const Router = Compose([newRouter.routes(), apiRouter.routes()])

module.exports = Router
