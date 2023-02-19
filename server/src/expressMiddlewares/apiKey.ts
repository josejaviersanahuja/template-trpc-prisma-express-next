import debug from 'debug'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
const debugLog = debug('server:apiKey')
debugLog.enabled = true

export default function apiKeyAuthorization (req: Request, res: Response, next: NextFunction) {
  if (req.headers.apikey !== process.env.API_KEY) {
    debugLog('API KEY NOT OK', req.headers.apikey)
    next(createHttpError.Unauthorized())
  } else {
    debugLog('API KEY OK', req.path)
    next()
  }
}
