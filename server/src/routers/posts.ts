import { prisma, publicProcedure, router } from '../trpc'
import { z } from 'zod'

/**
 * @description This postProcedure is used to validate the input of the query
 * but can be extended for every single query
 */
const postProcedure = publicProcedure.input(z.object({
  email: z.string().email()
}))
// Create a procedure is also important to create TRPC Middlewares

export const postRouter = router({
  findPostByAuthorEmail: postProcedure
    .query(async (req) => {
      const posts = await prisma.post.findMany({
        where: {
          author: {
            email: req.input.email
          }
        }
      })
      return posts
    }),
  getPostByEmailAndTitle: postProcedure
    .input(z.object({
      title: z.string()
    }))
    .query(async (req) => {
      const post = await prisma.post.findMany({
        where: {
          author: {
            email: req.input.email
          },
          OR: [
            {
              titleSpanish: req.input.title
            }, {
              titleEnglish: req.input.title
            }
          ]
        }
      })
      return post
    })
})
