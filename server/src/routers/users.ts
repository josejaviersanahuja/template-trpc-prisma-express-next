import { prisma, publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { adminProcedure } from '../trpcMiddlewares/isAdminMiddleware'

export const userRouter = router({
  getUserById: publicProcedure
    .input(z.object({
      id: z.string().uuid()
    }))
    .query(async (req) => {
      const user = await prisma.user.findUnique({
        where: {
          id: req.input.id
        }
      })
      return user
    }),
  getUserByEmail: publicProcedure
    .input(z.object({
      email: z.string().email()
    }))
    .query(async (req) => {
      const user = await prisma.user.findUnique({
        where: {
          email: req.input.email
        }
      })
      return user
    }),
  deleteAllUsers: adminProcedure // This middleware is used to validate if the user is an admin
    .mutation(async () => {
      await prisma.user.deleteMany()
      return {
        message: 'All users deleted'
      }
    })
})

// t.query is for GET requests
// t.mutation is for POST PUT & DELETE requests or any other request like console.log
// t.subscription is for websocket requests
