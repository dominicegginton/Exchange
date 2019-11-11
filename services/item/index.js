'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const itemRouter = require('./routes/item')

/* COMPOSE ROUTERS */
const Router = Compose([itemRouter.routes()])

module.exports = Router
