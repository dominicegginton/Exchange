#!/usr/bin/env node

'use strict'

/* IMPORT KOA MODULES */
const Koa = require('koa')
const Static = require('koa-static')
const BodyParser = require('koa-bodyparser')
const Body = require('koa-body')
const Session = require('koa-session')
const Logger = require('koa-logger')
const Views = require('koa-views')

/* IMPORT GLOBAL ROUTES */
const HomeRouter = require('./routes/home')
const StylesheetRouter = require('./routes/stylesheet')

/* IMPORT MIDDLEWARE */
const Authentication = require('./middleware/authentication')
const Offer = require('./middleware/offer')
const Suggestion = require('./middleware/suggestion')

/* IMPORT SERVICES */
const UserService = require('./services/user')
const ItemService = require('./services/item')
const WishlistService = require('./services/wishlist')
const OfferService = require('./services/offer')
const SuggestionService = require('./services/suggestion')

/* SETUP KOA */
const app = new Koa()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['secret']
app.use(Views('./views', { extension: 'pug' }))
app.use(Static('public'))
app.use(Body({multipart: true}))
app.use(BodyParser())
app.use(Session(app))
if (process.env.NODE_ENV === 'development') app.use(Logger())
app.use(Authentication)
app.use(Offer)
app.use(Suggestion)

/* SETUP GLOBAL ROUTES */
app.use(HomeRouter.routes())
app.use(StylesheetRouter.routes())

/* SETUP SERVICES */
app.use(UserService)
app.use(ItemService)
app.use(WishlistService)
app.use(OfferService)
app.use(SuggestionService)

/* SETUP PORT */
const defaultPort = 8080
const port = process.env.EXCHANGE_SERVER_PORT || defaultPort

/* RUN APP */
module.exports = app.listen(port, async() => console.log(`Server started on port ${port}`))
