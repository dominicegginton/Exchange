'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')

/* COMPOSE ROUTERS */
const Router = Compose([registerRouter.routes(), loginRouter.routes()])

module.exports = Router
