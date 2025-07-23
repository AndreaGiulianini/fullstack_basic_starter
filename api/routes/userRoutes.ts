import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { betterAuthMiddleware } from '../middleware/betterAuth'
import { userRepository } from '../models'
import type { SafeUserApi, User } from '../types/database'
import { NotFoundError } from '../utils/appError'
import { toFastifySchema } from '../utils/schemaHelper'
import {
  type CreateUserBody,
  createUserBodySchema,
  createUserBodySchemaForDocs,
  createUserResponseSchemaForDocs,
  getUserResponseSchemaForDocs,
  type UserParams,
  userParamsSchema,
  userParamsSchemaForDocs
} from '../utils/schemas'
import { validateBody, validateParams } from '../utils/validation'

async function userRoutes(fastify: FastifyInstance) {
  // GET /api/users/:id - Get user by ID
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

      // Validate text ID (better-auth uses text IDs, not UUIDs)
      const validatedUserId = id.trim()
      if (!validatedUserId) {
        throw new NotFoundError('Invalid user ID')
      }

      const user: User | undefined = await userRepository.findById(validatedUserId)
      if (!user) {
        throw new NotFoundError('User not found')
      }

      // Return safe user data without password, with API-ready date format
      const safeUser: SafeUserApi = {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt.toISOString()
      }

      return reply.send({ success: true, data: safeUser })
    }
  })

  // POST /api/users - Create new user
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

      // Input validation is handled in the repository
      const user: User = await userRepository.create({ name, email, password })

      // Return safe user data without password, with API-ready date format
      const safeUser: SafeUserApi = {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt.toISOString()
      }

      return reply.send({ success: true, data: safeUser, message: 'User created successfully' })
    }
  })
}

export default userRoutes
