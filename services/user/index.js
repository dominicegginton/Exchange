'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const registerRouter = require('./routes/register')

/* COMPOSE ROUTERS */
const Router = Compose([registerRouter.routes()])

module.exports = Router
