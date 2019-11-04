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

/* SETUP KOA */
const app = new Koa()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['secret']
app.use(Views('./views', { extension: 'pug' }))
app.use(Static('public'))
app.use(Body({multipart: true}))
app.use(BodyParser())
app.use(Session(app))
app.use(Logger())

/* SETUP PORT */
const defaultPort = 8080
const port = process.env.APP_PORT || defaultPort

/* RUN APP */
module.exports = app.listen(port, async() => console.log(`Server started on port ${port}`))
