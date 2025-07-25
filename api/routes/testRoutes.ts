import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { healthcheckResponseSchema, identityCountBodySchema, identityCountResponseSchema } from '../schemas'
import { CACHE_KEYS, ERROR_MESSAGES, TIMEOUTS } from '../utils/constants'
import logger from '../utils/logger'
import { createRouteSchema } from '../utils/schemaConverter'
import { validateData } from '../utils/validation'
import valkey from '../utils/valkey'

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Sleep utility for simulating delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// =============================================================================
// TEST ROUTES WITH UNIFIED ZOD SYSTEM
// Zod schemas are the single source of truth for both validation and docs
// =============================================================================

async function testRoutes(fastify: FastifyInstance) {
  // GET /api/healthcheck/ping - Basic health check with cache test
  fastify.get('/api/healthcheck/ping', {
    schema: createRouteSchema({
      description: 'Test Fastify server and cache connectivity',
      tags: ['Test'],
      response: {
        200: healthcheckResponseSchema
      }
    }),
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      const data = await valkey.get(CACHE_KEYS.TEST_KEY)
      if (!data) {
        await valkey.set(CACHE_KEYS.TEST_KEY, CACHE_KEYS.TEST_VALUE)
        logger.info('ping')
      }
      const response = { success: true, message: ERROR_MESSAGES.SUCCESS_RESPONSE_MESSAGE }
      return reply.send(response)
    }
  })

  // POST /api/identity-count - Test Redux with delay simulation
  fastify.post('/api/identity-count', {
    schema: createRouteSchema({
      description: 'Test Redux state management with simulated delay',
      tags: ['Test'],
      body: identityCountBodySchema,
      response: {
        200: identityCountResponseSchema
      }
    }),
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // Validate request body - same schema used for docs!
      const { amount } = validateData(identityCountBodySchema, request.body)

      // Simulate processing delay
      await sleep(TIMEOUTS.IDENTITY_COUNT_DELAY)

      const response = { success: true, amount }
      return reply.send(response)
    }
  })
}

export default testRoutes
