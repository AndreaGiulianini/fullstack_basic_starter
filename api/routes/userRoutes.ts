import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { betterAuthMiddleware } from '../middleware/betterAuth'
import { createUser, findUserById } from '../services'
import { NotFoundError } from '../utils/appError'
import { ERROR_MESSAGES } from '../utils/constants'
import {
  type CreateUserBody,
  createUserBodySchema,
  createUserResponseSchema,
  getUserResponseSchema,
  type SafeUserApi,
  type User,
  type UserParams,
  userParamsSchema
} from '../utils/schemas'
import { createRouteSchema } from '../utils/schemas/schemaConverter'
import { validateData } from '../utils/validation'

// =============================================================================
// USER ROUTES WITH UNIFIED ZOD SYSTEM
// Zod schemas are the single source of truth for both validation and docs
// =============================================================================

async function userRoutes(fastify: FastifyInstance) {
  // GET /api/users/:id - Get user by ID
  fastify.get('/api/users/:id', {
    schema: createRouteSchema({
      description: 'Get a user by ID',
      tags: ['User'],
      params: userParamsSchema,
      response: {
        200: getUserResponseSchema
      },
      security: [{ bearerAuth: [] }]
    }),
    preHandler: [betterAuthMiddleware],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // Validate request parameters - same schema used for docs!
      const { id }: UserParams = validateData(userParamsSchema, request.params)

      const user: User | undefined = await findUserById(id)
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND)
      }

      // Create safe user object without sensitive data
      const safeUser: SafeUserApi = {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt
      }

      return reply.send({ success: true, data: safeUser })
    }
  })

  // POST /api/users - Create new user
  fastify.post('/api/users', {
    schema: createRouteSchema({
      description: 'Create a new user',
      tags: ['User'],
      body: createUserBodySchema,
      response: {
        200: createUserResponseSchema
      }
    }),
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // Validate request body - same schema used for docs!
      const { name, email, password }: CreateUserBody = validateData(createUserBodySchema, request.body)

      const user: User = await createUser({ name, email, password })

      // Create safe user object without sensitive data
      const safeUser: SafeUserApi = {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt
      }

      return reply.send({
        success: true,
        data: safeUser,
        message: 'User created successfully'
      })
    }
  })
}

export default userRoutes
