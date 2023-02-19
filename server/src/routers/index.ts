import { t } from '../trpc'
import { z } from 'zod'
import debug from 'debug'

import { userRouter } from './users'
import { postRouter } from './posts'

const debugLog = debug('client:dev')
debugLog.enabled = true

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({
      name: z.string()
    }))
    .query(req => {
      return `Hello ${req.input.name}`
    }),
  logToServer: t.procedure.input(z.string())
    .mutation((req) => {
      debugLog(req.input)
    }),
  users: userRouter, // nested router
  posts: postRouter
})

export type AppRouter = typeof appRouter

// Merge routers
// export const mergedRouter = t.mergeRouters(appRouter, userRouter)

// t.query is for GET requests
// t.mutation is for POST PUT & DELETE requests
// or any other request like console.log
// t.subscription is for websocket requests
