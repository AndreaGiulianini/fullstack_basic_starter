import type { FastifyInstance } from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import logger from 'src/utils/logger'
import valkey from 'src/utils/valkey'

// Define the sleep function
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function testRoutes(fastify: FastifyInstance) {
  fastify.get('/api/healthcheck/ping', {
    schema: {
      description: 'Test Fastify',
      tags: ['Test'],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      const data = await valkey.get('test')
      if (!data) {
        await valkey.set('test', 'ping')
        logger.info('ping')
      }
      reply.send({ success: true, message: 'pong' })
    }
  })

  fastify.post('/api/identity-count', {
    schema: {
      description: 'Test Redux',
      tags: ['Test'],
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Value to change' }
        },
        required: ['amount']
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            amount: { type: 'number' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { amount } = request.body as { amount: number }
      await sleep(700)
      reply.send({ success: true, amount })
    }
  })
}

export default testRoutes
