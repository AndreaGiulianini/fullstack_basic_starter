import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createUserHandler, getUserHandler } from '../controllers/userController'

export const userParamsSchema = z.object({
  userId: z.string()
})

export const userResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string()
  })
})

export const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
})

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/api/users/:userId', {
    schema: {
      description: 'Get a user by ID',
      tags: ['User'],
      params: z.toJSONSchema(userParamsSchema),
      response: {
        200: z.toJSONSchema(userResponseSchema)
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const parsedParams = userParamsSchema.safeParse(request.params)
      if (!parsedParams.success) {
        return reply.status(400).send({ success: false, message: 'Invalid params', errors: parsedParams.error })
      }
      await getUserHandler(request, reply)
    }
  })

  fastify.post('/api/users', {
    schema: {
      description: 'Create a User',
      tags: ['User'],
      body: z.toJSONSchema(createUserBodySchema),
      response: {
        200: z.toJSONSchema(userResponseSchema)
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const parsedBody = createUserBodySchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.status(400).send({ success: false, message: 'Invalid body', errors: parsedBody.error })
      }
      await createUserHandler(request, reply)
    }
  })
}

export default userRoutes
