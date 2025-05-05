import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import logger from 'src/utils/logger'
import valkey from 'src/utils/valkey'
import { z } from 'zod'

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
        200: z.toJSONSchema(healthcheckResponseSchema)
      }
    },
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      const data = await valkey.get('test')
      if (!data) {
        await valkey.set('test', 'ping')
        logger.info('ping')
      }
      const response = { success: true, message: 'pong' }
      const responseParsed = healthcheckResponseSchema.safeParse(response)
      if (!responseParsed.success) {
        return reply.status(500).send({ success: false, message: responseParsed.error })
      }
      reply.send(response)
    }
  })

  fastify.post('/api/identity-count', {
    schema: {
      description: 'Test Redux',
      tags: ['Test'],
      body: z.toJSONSchema(identityCountBodySchema),
      response: {
        200: z.toJSONSchema(identityCountResponseSchema)
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const parsedBody = identityCountBodySchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.status(400).send({ success: false, message: parsedBody.error })
      }
      const { amount } = parsedBody.data
      await sleep(700)
      const response = { success: true, amount }
      const responseParsed = identityCountResponseSchema.safeParse(response)
      if (!responseParsed.success) {
        return reply.status(500).send({ success: false, message: responseParsed.error })
      }
      reply.send(response)
    }
  })
}

export default testRoutes
