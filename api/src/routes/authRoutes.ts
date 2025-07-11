import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { login, profile, refreshToken } from 'src/controllers/authController'
import { AuthenticationError } from '../errors/appError'
import {
  type JWTPayload,
  type LoginBody,
  type LoginResponse,
  loginBodySchema,
  loginResponseSchema,
  profileResponseSchema,
  type RefreshTokenBody,
  refreshTokenBodySchema,
  refreshTokenResponseSchema
} from '../schemas'
import type { AuthenticatedFastifyRequest } from '../types/fastify'
import { toFastifySchema } from '../utils/schemaHelper'
import { validateBody } from '../utils/validation'

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/login', {
    schema: {
      body: toFastifySchema(loginBodySchema),
      response: {
        200: toFastifySchema(loginResponseSchema)
      },
      tags: ['Auth'],
      description: 'Get a JWT Token'
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password }: LoginBody = validateBody(loginBodySchema, request.body)
      const tokens = await login(email, password, fastify.generateTokens)
      const response: LoginResponse = { success: true, ...tokens }
      return reply.send(response)
    }
  })

  fastify.post('/api/refresh-token', {
    schema: {
      body: toFastifySchema(refreshTokenBodySchema),
      response: {
        200: toFastifySchema(refreshTokenResponseSchema)
      },
      tags: ['Auth'],
      description: 'Refresh JWT Token'
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { refreshToken: refreshTokenValue }: RefreshTokenBody = validateBody(refreshTokenBodySchema, request.body)
      const tokens = await refreshToken(
        refreshTokenValue,
        request.server.verifyRefreshToken,
        request.server.revokeRefreshToken,
        request.server.generateTokens
      )
      const response: LoginResponse = { success: true, ...tokens }
      return reply.send(response)
    }
  })

  fastify.get('/api/profile', {
    schema: {
      response: {
        200: toFastifySchema(profileResponseSchema)
      },
      tags: ['Auth'],
      description: 'Get a user by JWT',
      security: [{ bearerAuth: [] }]
    },
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const authenticatedRequest = request as AuthenticatedFastifyRequest
      const { user }: { user: JWTPayload } = authenticatedRequest
      if (!user || !user.id) {
        throw new AuthenticationError('Unauthorized')
      }
      const userProfile = await profile(user.id)
      return reply.send({ success: true, user: userProfile })
    }
  })
}

export default authRoutes
