import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createUserHandler, getUserHandler } from '../controllers/userController'
import {
  type CreateUserBody,
  createUserBodySchema,
  createUserResponseSchema,
  getUserResponseSchema,
  type UserParams,
  userParamsSchema,
  z
} from '../schemas'
import { routeHandler, sendSuccess, validateBody, validateParams } from '../utils/routeHelpers'

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/api/users/:userId', {
    schema: {
      description: 'Get a user by ID',
      tags: ['User'],
      params: z.toJSONSchema(userParamsSchema),
      response: {
        200: z.toJSONSchema(getUserResponseSchema)
      }
    },
    handler: routeHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId }: UserParams = validateParams(userParamsSchema, request.params)
      const user = await getUserHandler(userId)
      return sendSuccess(reply, user)
    })
  })

  fastify.post('/api/users', {
    schema: {
      description: 'Create a User',
      tags: ['User'],
      body: z.toJSONSchema(createUserBodySchema),
      response: {
        200: z.toJSONSchema(createUserResponseSchema)
      }
    },
    handler: routeHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, email, password }: CreateUserBody = validateBody(createUserBodySchema, request.body)
      const user = await createUserHandler(name, email, password)
      return sendSuccess(reply, user, 'User created successfully')
    })
  })
}

export default userRoutes
