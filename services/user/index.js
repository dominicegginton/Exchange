'use strict'

/* IMPORT KOA COMPOSE */
const Compose = require('koa-compose')

/* IMPORT ROUTERS */
const userRouter = require('./routes/user')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const avatarRouter = require('./routes/avatar')
const apiRouter = require('./routes/api')
/* COMPOSE ROUTERS */
const Router = Compose([userRouter.routes(), registerRouter.routes(),
	loginRouter.routes(), logoutRouter.routes(), avatarRouter.routes(), apiRouter.routes()])

module.exports = Router
