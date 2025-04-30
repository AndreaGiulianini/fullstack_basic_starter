import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { login, profile, refreshToken } from 'src/controllers/authController'
import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password required')
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  accessToken: z.string(),
  refreshToken: z.string()
})

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string()
})

export const refreshTokenResponseSchema = loginResponseSchema

export const profileResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.email()
  })
})

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/login', {
    schema: {
      body:  z.toJSONSchema(loginBodySchema),
      response: {
        200:  z.toJSONSchema(loginResponseSchema)
      },
      tags: ['Auth'],
      description: 'Get a JWT Token'
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const parsedBody = loginBodySchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.status(400).send({ success: false, message: parsedBody.error })
      }
      await login(request, reply)
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
      await refreshToken(request, reply)
    }
  })

  fastify.get('/api/profile', {
    schema: {
      response: {
        200: z.toJSONSchema(profileResponseSchema)
      },
      tags: ['Auth'],
      description: 'Get a user by JWT'
    },
    preHandler: [fastify.authenticate],
    handler: profile
  })
}

export default authRoutes
