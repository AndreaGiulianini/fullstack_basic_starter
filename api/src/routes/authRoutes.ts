import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { login, profile, refreshToken } from 'src/controllers/authController'
import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password required')
})

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string()
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  message: z.string().optional()
})

export const refreshTokenResponseSchema = loginResponseSchema

export const profileResponseSchema = z.object({
  success: z.boolean(),
  user: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.email()
    })
    .optional(),
  message: z.string().optional()
})

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
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const parsedBody = loginBodySchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.status(400).send({ success: false, message: parsedBody.error })
      }
      const { email, password } = parsedBody.data
      const token = await login(email, password, fastify.generateTokens)
      if (token instanceof Error) {
        return reply.status(401).send({ success: false, message: token.message })
      }
      const result = { success: true, ...token }
      const parsedResponse = loginResponseSchema.safeParse(result)
      if (!parsedResponse.success) {
        return reply.status(500).send({ success: false, message: parsedResponse.error })
      }
      reply.send(parsedResponse.data)
    }
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
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const parsedBody = refreshTokenBodySchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.status(400).send({ success: false, message: parsedBody.error })
      }
      const { refreshToken: refreshTokenValue } = parsedBody.data
      const token = await refreshToken(
        refreshTokenValue,
        request.server.verifyRefreshToken,
        request.server.revokeRefreshToken,
        request.server.generateTokens
      )
      if (token instanceof Error) {
        return reply.status(401).send({ success: false, message: token.message })
      }
      const response = { success: true, ...token }
      const parsedResponse = refreshTokenResponseSchema.safeParse(response)
      if (!parsedResponse.success) {
        return reply.status(500).send({ success: false, message: parsedResponse.error })
      }
      reply.send(parsedResponse.data)
    }
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
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      console.log('Profile route')
      const { user } = request as any // Type assertion to do
      if (!user || !user.id) {
        return reply.status(401).send({ success: false, message: 'Unauthorized' })
      }
      const userProfile = await profile(user.id)
      if (userProfile instanceof Error) {
        return reply.status(500).send({ success: false, message: userProfile.message })
      }
      const response = { success: true, user: userProfile }
      const parsedResponse = profileResponseSchema.safeParse(response)
      if (!parsedResponse.success) {
        return reply.status(500).send({ success: false, message: parsedResponse.error })
      }
      reply.send(parsedResponse.data)
    }
  })
}

export default authRoutes
