'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const newRouter = require('./routes/new')

/* COMPOSE ROUTERS */
const Router = Compose([newRouter.routes()])

module.exports = Router
