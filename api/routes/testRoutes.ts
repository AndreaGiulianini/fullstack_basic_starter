import logger from '@utils/logger'
import { toFastifySchema } from '@utils/schemaHelper'
import { validateBody } from '@utils/validation'
import valkey from '@utils/valkey'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import * as z from 'zod'
import { CACHE_KEYS, ERROR_MESSAGES, TIMEOUTS } from '../constants'

export const identityCountBodySchema = z.object({
  amount: z.number({ error: 'Amount is required' })
})

export const identityCountResponseSchema = z.object({
  success: z.boolean(),
  amount: z.number().optional(),
  message: z.string().optional()
})

export const healthcheckResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
})

// Define the sleep function
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function testRoutes(fastify: FastifyInstance) {
  fastify.get('/api/healthcheck/ping', {
    schema: {
      description: 'Test Fastify',
      tags: ['Test'],
      response: {
        200: toFastifySchema(healthcheckResponseSchema)
      }
    },
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

  fastify.post('/api/identity-count', {
    schema: {
      description: 'Test Redux',
      tags: ['Test'],
      body: toFastifySchema(identityCountBodySchema),
      response: {
        200: toFastifySchema(identityCountResponseSchema)
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { amount } = validateBody(identityCountBodySchema, request.body)
      await sleep(TIMEOUTS.IDENTITY_COUNT_DELAY)
      const response = { success: true, amount }
      return reply.send(response)
    }
  })
}

export default testRoutes
