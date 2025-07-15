import type { FastifyInstance } from 'fastify'
import { auth } from '../utils/db'

export default async function betterAuthRoutes(fastify: FastifyInstance) {
  // Handle all better-auth routes
  fastify.all('/api/auth/*', {
    schema: {
      hide: true // Hide from swagger docs
    },
    handler: async (request, reply) => {
      // Convert Fastify request to standard Request object
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: request.method,
        headers: request.headers as HeadersInit,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? JSON.stringify(request.body) : undefined
      })

      // Get response from better-auth
      const response = await auth.handler(webRequest)

      // Convert response back to Fastify format
      const responseBody = await response.text()

      // Set headers
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      // Send response
      reply.code(response.status).send(responseBody)
    }
  })
}
