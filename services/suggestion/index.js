'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const apiRouter = require('./routes/api')

/* COMPOSE ROUTERS */
const Router = Compose([apiRouter.routes()])

module.exports = Router
