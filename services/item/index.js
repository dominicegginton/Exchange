'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const detailsRouter = require('./routes/details')
const newRouter = require('./routes/new')
const apiRouter = require('./routes/api')
const imageRouter = require('./routes/image')

/* COMPOSE ROUTERS */
const Router = Compose([detailsRouter.routes(), newRouter.routes(), apiRouter.routes(), imageRouter.routes()])

module.exports = Router
