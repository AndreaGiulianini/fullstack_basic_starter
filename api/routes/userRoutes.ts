import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createUserHandler, getUserHandler } from '../controllers/userController'
import { betterAuthMiddleware } from '../middleware/betterAuth'
import {
  type CreateUserBody,
  createUserBodySchema,
  createUserBodySchemaForDocs,
  createUserResponseSchemaForDocs,
  getUserResponseSchemaForDocs,
  type UserParams,
  userParamsSchema,
  userParamsSchemaForDocs
} from '../openapi-schemas'
import { toFastifySchema } from '../utils/schemaHelper'
import { validateBody, validateParams } from '../utils/validation'

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/api/users/:id', {
    schema: {
      description: 'Get a user by ID',
      tags: ['User'],
      params: toFastifySchema(userParamsSchemaForDocs),
      response: {
        200: toFastifySchema(getUserResponseSchemaForDocs)
      },
      security: [{ bearerAuth: [] }]
    },
    preHandler: [betterAuthMiddleware],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { id }: UserParams = validateParams(userParamsSchema, request.params)
      const user = await getUserHandler(id)
      return reply.send({ success: true, data: user })
    }
  })

  fastify.post('/api/users', {
    schema: {
      description: 'Create a User',
      tags: ['User'],
      body: toFastifySchema(createUserBodySchemaForDocs),
      response: {
        200: toFastifySchema(createUserResponseSchemaForDocs)
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
