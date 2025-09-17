import type { FastifyInstance } from 'fastify'
import * as z from 'zod'
import { auth } from '../utils/db'
import {
  betterAuthForgotPasswordSchema,
  betterAuthResetPasswordSchema,
  betterAuthSessionResponseSchema,
  betterAuthSignInSchema,
  betterAuthSignUpSchema,
  betterAuthSocialSignInSchema,
  betterAuthSuccessResponseSchema,
  errorResponseSchema
} from '../utils/schemas'
import { createRouteSchema } from '../utils/schemas/schemaConverter'

// =============================================================================
// BETTER-AUTH ROUTES WITH UNIFIED ZOD SYSTEM
// Properly documented Better-Auth endpoints with OpenAPI schemas
// =============================================================================

export default async function betterAuthRoutes(fastify: FastifyInstance) {
  // POST /api/auth/sign-up/email - Sign up with email and password
  fastify.post('/api/auth/sign-up/email', {
    schema: createRouteSchema({
      description: 'Create a new user account using email and password',
      tags: ['Authentication'],
      body: betterAuthSignUpSchema,
      response: {
        200: betterAuthSessionResponseSchema,
        400: errorResponseSchema,
        409: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      // Convert Fastify request to standard Request object
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'POST', 
        headers: request.headers as HeadersInit,
        body: JSON.stringify(request.body)
      })

      // Get response from better-auth
      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      // Set headers
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // POST /api/auth/sign-in/email - Sign in with email and password
  fastify.post('/api/auth/sign-in/email', {
    schema: createRouteSchema({
      description: 'Sign in to an existing account using email and password',
      tags: ['Authentication'],
      body: betterAuthSignInSchema,
      response: {
        200: betterAuthSessionResponseSchema,
        400: errorResponseSchema,
        401: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'POST', 
        headers: request.headers as HeadersInit,
        body: JSON.stringify(request.body)
      })

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // POST /api/auth/sign-in/social - Sign in with social provider
  fastify.post('/api/auth/sign-in/social', {
    schema: createRouteSchema({
      description: 'Sign in using a social authentication provider (Google, GitHub, etc.)',
      tags: ['Authentication'],
      body: betterAuthSocialSignInSchema,
      response: {
        200: betterAuthSessionResponseSchema,
        302: z
          .object({
            location: z.string().describe('Redirect URL to social provider')
          })
          .describe('Redirect response'),
        400: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'POST', 
        headers: request.headers as HeadersInit,
        body: JSON.stringify(request.body)
      })

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // POST /api/auth/sign-out - Sign out current session
  fastify.post('/api/auth/sign-out', {
    schema: createRouteSchema({
      description: 'Sign out of the current session and invalidate the session token',
      tags: ['Authentication'],
      response: {
        200: betterAuthSuccessResponseSchema,
        401: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'POST', 
        headers: request.headers as HeadersInit,
        body: JSON.stringify(request.body)
      })

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // GET /api/auth/get-session - Get current session information
  fastify.get('/api/auth/get-session', {
    schema: createRouteSchema({
      description: 'Retrieve the current user session and user information',
      tags: ['Authentication'],
      response: {
        200: betterAuthSessionResponseSchema,
        401: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'GET', // Explicitly set GET method
        headers: request.headers as HeadersInit
      })

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // POST /api/auth/forgot-password - Request password reset
  fastify.post('/api/auth/forgot-password', {
    schema: createRouteSchema({
      description: 'Request a password reset email for the specified email address',
      tags: ['Authentication'],
      body: betterAuthForgotPasswordSchema,
      response: {
        200: betterAuthSuccessResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'POST', 
        headers: request.headers as HeadersInit,
        body: JSON.stringify(request.body)
      })

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // POST /api/auth/reset-password - Reset password with token
  fastify.post('/api/auth/reset-password', {
    schema: createRouteSchema({
      description: 'Reset user password using a valid reset token',
      tags: ['Authentication'],
      body: betterAuthResetPasswordSchema,
      response: {
        200: betterAuthSuccessResponseSchema,
        400: errorResponseSchema,
        401: errorResponseSchema
      }
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const webRequest = new Request(url, {
        method: 'POST', 
        headers: request.headers as HeadersInit,
        body: JSON.stringify(request.body)
      })

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })

  // Handle all other better-auth routes as catch-all
  // This covers OAuth callbacks, email verification, and other dynamic routes
  fastify.all('/api/auth/*', {
    schema: createRouteSchema({
      description: 'Better-Auth dynamic routes (OAuth callbacks, email verification, etc.)',
      tags: ['Authentication']
    }),
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`)
      
      // Create request options based on HTTP method
      const requestOptions: RequestInit = {
        method: request.method,
        headers: request.headers as HeadersInit
      }
      
      // Only add body for POST requests
      if (request.method === 'POST') {
        requestOptions.body = JSON.stringify(request.body)
      }
      
      const webRequest = new Request(url, requestOptions)

      const response = await auth.handler(webRequest)
      const responseBody = await response.text()

      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })

      return reply.code(response.status).send(responseBody)
    }
  })
}
