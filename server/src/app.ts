import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import * as path from 'path'
import * as fs from 'fs'
import logger from 'morgan'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import debug from 'debug'

import { appRouter } from './routers'
import { createContext } from './trpc'
import apiKey from './expressMiddlewares/apiKey'
import createHttpError, { HttpError } from 'http-errors'
import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'

const debugLog = debug('server:app')
debugLog.enabled = true

// Init app
const app = express()

// CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions))

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/../access.log'), { flags: 'a' })
app.use(logger('combined', { stream: accessLogStream }))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(apiKey)

// tRPC
app.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }))

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 404
app.use((req, res, next) => {
  next(createHttpError.NotFound())
})

// error handler
app.use((err: HttpError | TRPCError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  if (err instanceof HttpError) {
    res.status(err.status).json(err)
  } else if (err instanceof TRPCError) {
    const httpCode = getHTTPStatusCodeFromError(err)
    res.status(httpCode).json(err)
  } else {
    debugLog(err)
    res.status(500).json({ ...err, instanceOf: false })
  }
})

export default app
