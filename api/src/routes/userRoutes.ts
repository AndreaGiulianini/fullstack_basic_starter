import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createUserHandler, getUserHandler } from '../controllers/userController'
import {
  type CreateUserBody,
  createUserBodySchema,
  createUserResponseSchema,
  getUserResponseSchema,
  type UserParams,
  userParamsSchema
} from '../schemas'
import { toFastifySchema } from '../utils/schemaHelper'
import { validateBody, validateParams } from '../utils/validation'

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/api/users/:userId', {
    schema: {
      description: 'Get a user by ID',
      tags: ['User'],
      params: toFastifySchema(userParamsSchema),
      response: {
        200: toFastifySchema(getUserResponseSchema)
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId }: UserParams = validateParams(userParamsSchema, request.params)
      const user = await getUserHandler(userId)
      return reply.send({ success: true, data: user })
    }
  })

  fastify.post('/api/users', {
    schema: {
      description: 'Create a User',
      tags: ['User'],
      body: toFastifySchema(createUserBodySchema),
      response: {
        200: toFastifySchema(createUserResponseSchema)
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, email, password }: CreateUserBody = validateBody(createUserBodySchema, request.body)
      const user = await createUserHandler(name, email, password)
      return reply.send({ success: true, data: user, message: 'User created successfully' })
    }
  })
}

export default userRoutes
