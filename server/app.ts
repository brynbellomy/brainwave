
///<reference path='../typings/tsd.d.ts' />

import express = require('express')
import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import * as logger from 'morgan'
import cookieParser = require('cookie-parser')
import favicon = require('serve-favicon')

import * as routes from './routes'
import * as middleware from './middleware'
import * as helpers from '../src/helpers'
import { HTTPError } from './http-error'

let app = express()

/**
    configuration
 */
app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'jade')

// app.use(favicon())
app.use(logger('dev'))
app.use(cookieParser())

app.use('/static', express.static('./public'))
app.use('/', routes.router)

// app.get('/', routes.index)
// app.get('/lyrics', routes.getLyrics)

// --- '404 not found' middleware
app.use(middleware.error404)

// --- general error handling middleware
app.use(middleware.routeError)


app.locals.resourceURL = helpers.resourceURL
