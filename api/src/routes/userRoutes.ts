import type { FastifyInstance } from 'fastify'
import { createUserHandler, getUserHandler } from '../controllers/userController'

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/api/users/:userId', {
    schema: {
      description: 'Get a user by ID',
      tags: ['User'],
      params: {
        type: 'object', // The params need to be an object
        properties: {
          userId: { type: 'string', description: 'User ID' }
        },
        required: ['userId'] // Mark userId as required inside the params object
      },
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
    handler: getUserHandler
  })

  fastify.post('/api/users', {
    schema: {
      description: 'Create a User',
      tags: ['User'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'User name' },
          email: { type: 'string', description: 'User email' },
          password: { type: 'string', description: 'User password' }
        },
        required: ['name', 'email', 'password']
      },
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
    handler: createUserHandler
  })
}

export default userRoutes
