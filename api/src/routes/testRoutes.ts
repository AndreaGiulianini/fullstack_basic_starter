import type { FastifyInstance } from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'

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
      reply.send({ message: 'pong' })
    }
  })
}

export default testRoutes
