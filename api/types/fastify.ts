import type { FastifyReply, FastifyRequest } from 'fastify'
import type { JWTPayload } from './auth'

// Extended Fastify Request with typed user
export interface AuthenticatedFastifyRequest extends FastifyRequest {
  user: JWTPayload
}

// Pre-handler types
export type PreHandler = (request: FastifyRequest, reply: FastifyReply) => Promise<void>

export type AuthenticatedPreHandler = (request: AuthenticatedFastifyRequest, reply: FastifyReply) => Promise<void>

// Schema types for route definitions
export interface RouteSchema<_TBody = unknown, _TParams = unknown, _TQuery = unknown, _TResponse = unknown> {
  body?: unknown
  params?: unknown
  querystring?: unknown
  response?: {
    [statusCode: number]: unknown
  }
  tags?: string[]
  description?: string
  summary?: string
  security?: Array<{ [key: string]: string[] }>
}

// Route options type
export interface RouteOptions<TBody = unknown, TParams = unknown, TQuery = unknown, TResponse = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  url: string
  schema?: RouteSchema<TBody, TParams, TQuery, TResponse>
  preHandler?: PreHandler | PreHandler[]
}

// Note: FastifyInstance extensions are declared in utils/jwt.ts
