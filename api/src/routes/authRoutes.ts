import type { FastifyInstance } from 'fastify'
import { login, profile } from 'src/controllers/authController'

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/login', {
    schema: {
      description: 'Get a JWT Token',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'User email' },
          password: { type: 'string', description: 'User password' }
        },
        required: ['email', 'password']
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            token: { type: 'string' }
          }
        }
      }
    },
    handler: login
  })

  // Protected route
  fastify.get('/api/profile', {
    schema: {
      description: 'Get a user by JWT',
      tags: ['Auth'],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate],
    handler: profile
  })
}

export default authRoutes
