import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { login, profile, refreshToken } from 'src/controllers/authController'
import { AuthenticationError } from '../errors/appError'
import {
  type JWTPayload,
  type LoginBody,
  type LoginResponse,
  loginBodySchema,
  loginResponseSchema,
  type ProfileResponse,
  profileResponseSchema,
  type RefreshTokenBody,
  refreshTokenBodySchema,
  refreshTokenResponseSchema,
  z
} from '../schemas'
import type { AuthenticatedFastifyRequest } from '../types/fastify'
import { routeHandler, validateBody } from '../utils/routeHelpers'

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/login', {
    schema: {
      body: z.toJSONSchema(loginBodySchema),
      response: {
        200: z.toJSONSchema(loginResponseSchema)
      },
      tags: ['Auth'],
      description: 'Get a JWT Token'
    },
    handler: routeHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password }: LoginBody = validateBody(loginBodySchema, request.body)
      const tokens = await login(email, password, fastify.generateTokens)
      const response: LoginResponse = { success: true, ...tokens }
      return reply.send(response)
    })
  })

  fastify.post('/api/refresh-token', {
    schema: {
      body: z.toJSONSchema(refreshTokenBodySchema),
      response: {
        200: z.toJSONSchema(refreshTokenResponseSchema)
      },
      tags: ['Auth'],
      description: 'Refresh JWT Token'
    },
    handler: routeHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const { refreshToken: refreshTokenValue }: RefreshTokenBody = validateBody(refreshTokenBodySchema, request.body)
      const tokens = await refreshToken(
        refreshTokenValue,
        request.server.verifyRefreshToken,
        request.server.revokeRefreshToken,
        request.server.generateTokens
      )
      const response: LoginResponse = { success: true, ...tokens }
      return reply.send(response)
    })
  })

  fastify.get('/api/profile', {
    schema: {
      response: {
        200: z.toJSONSchema(profileResponseSchema)
      },
      tags: ['Auth'],
      description: 'Get a user by JWT',
      security: [{ bearerAuth: [] }]
    },
    preHandler: [fastify.authenticate],
    handler: routeHandler(async (request: FastifyRequest, reply: FastifyReply) => {
      const authenticatedRequest = request as AuthenticatedFastifyRequest
      const { user }: { user: JWTPayload } = authenticatedRequest
      if (!user || !user.id) {
        throw new AuthenticationError('Unauthorized')
      }
      const userProfile = await profile(user.id)
      const response: ProfileResponse = { success: true, user: userProfile }
      return reply.send(response)
    })
  })
}

export default authRoutes
