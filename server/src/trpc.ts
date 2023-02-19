import { initTRPC, TRPCError } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// create tRPC-Context
interface Context {
  user?: {
    id: string;
    isAdmin: boolean;
    // [..]
  };
}

export function createContext ({ req, res }: CreateExpressContextOptions) {
  return {
    // @TODO add your context here
    user: {
      id: '123',
      isAdmin: true
    }
  }
}

// Init trpc
export const t = initTRPC.context<Context>().create()

// Create Middleware @TODO
const isAdminMiddleware = t.middleware(async ({ ctx, next }) => {
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
        name: 'John Doe'
      }
    }
  })
})

// Create a procedure middleware
export const adminProcedure = t.procedure.use(isAdminMiddleware)
// go to userRouter to see how to use it
