import { TRPCError } from '@trpc/server'
import { middleware, publicProcedure } from '../trpc'

// Create Middleware @TODO
const isAdminMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.user?.isAdmin) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized to do this',
      cause: 'the cause is...'
    })
  }
  return next({
    ctx: {
      user: {
        id: '123',
        isAdmin: 'John Doe'
      }
    }
  })
})

// Create a procedure middleware
export const adminProcedure = publicProcedure.use(isAdminMiddleware)
// go to userRouter to see how to use it
