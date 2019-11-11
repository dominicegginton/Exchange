'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const itemRouter = require('./routes/item')
const imageRouter = require('./routes/image')

/* COMPOSE ROUTERS */
const Router = Compose([itemRouter.routes(), imageRouter.routes()])

module.exports = Router
