import { initTRPC } from '@trpc/server'
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

export function createContext ({ req, res }: CreateExpressContextOptions) : Context {
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

// router
export const router = t.router

// Create Middleware
export const middleware = t.middleware

// Create a procedure middleware
export const publicProcedure = t.procedure
