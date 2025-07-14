import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { profile } from '../controllers/authController'
import { AuthenticationError } from '../errors/appError'
import { betterAuthMiddleware } from '../middleware/betterAuth'
import { profileResponseSchemaForDocs } from '../schemas'
import type { AuthenticatedFastifyRequest } from '../types/fastify'
import { toFastifySchema } from '../utils/schemaHelper'

async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/api/profile', {
    schema: {
      response: {
        200: toFastifySchema(profileResponseSchemaForDocs)
      },
      tags: ['Auth'],
      description: 'Get current user profile',
      security: [{ bearerAuth: [] }]
    },
    preHandler: [betterAuthMiddleware],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const authenticatedRequest = request as AuthenticatedFastifyRequest
      const { user } = authenticatedRequest
      if (!user || !user.id) {
        throw new AuthenticationError('Unauthorized')
      }
      const userProfile = await profile(user.id)
      return reply.send({ success: true, user: userProfile })
    }
  })
}

export default authRoutes
