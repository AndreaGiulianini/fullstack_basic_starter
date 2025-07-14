import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { AuthenticatedUser } from './auth'

// =============================================================================
// ENHANCED FASTIFY REQUEST/REPLY TYPES
// =============================================================================

// Extended Fastify Request with authenticated user
export interface AuthenticatedFastifyRequest extends FastifyRequest {
  user: AuthenticatedUser
  requestId?: string
  startTime?: number
  validatedBody?: unknown
  validatedParams?: unknown
  validatedQuery?: unknown
}

// Extended Fastify Reply with additional methods
export interface AuthenticatedFastifyReply extends FastifyReply {
  user?: AuthenticatedUser
}

// =============================================================================
// MIDDLEWARE TYPES
// =============================================================================

// Pre-handler for authenticated routes
export type AuthenticatedPreHandler = (
  request: AuthenticatedFastifyRequest,
  reply: AuthenticatedFastifyReply
) => Promise<void> | void

// Generic pre-handler type
export type PreHandler = (request: FastifyRequest, reply: FastifyReply) => Promise<void> | void

// Validation middleware type
export type ValidationMiddleware<T = unknown> = (
  request: FastifyRequest & { validatedBody?: T; validatedParams?: T; validatedQuery?: T },
  reply: FastifyReply
) => Promise<void> | void

// =============================================================================
// ROUTE SCHEMA TYPES
// =============================================================================

// Enhanced route schema with better typing
export interface RouteSchema {
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
  deprecated?: boolean
  operationId?: string
  consumes?: string[]
  produces?: string[]
}

// =============================================================================
// ROUTE HANDLER TYPES
// =============================================================================

// Generic route handler
export type RouteHandler<TBody = unknown, TParams = unknown, TQuery = unknown, TResponse = unknown> = (
  request: FastifyRequest<{
    Body: TBody
    Params: TParams
    Querystring: TQuery
  }>,
  reply: FastifyReply
) => Promise<TResponse> | TResponse

// Authenticated route handler
export type AuthenticatedRouteHandler<TBody = unknown, TParams = unknown, TQuery = unknown, TResponse = unknown> = (
  request: AuthenticatedFastifyRequest & {
    body: TBody
    params: TParams
    query: TQuery
  },
  reply: AuthenticatedFastifyReply
) => Promise<TResponse> | TResponse

// =============================================================================
// ROUTE OPTIONS TYPES
// =============================================================================

// Enhanced route options with better typing
export interface RouteOptions<TBody = unknown, TParams = unknown, TQuery = unknown, TResponse = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  url: string
  schema?: RouteSchema
  preHandler?: PreHandler | PreHandler[]
  handler: RouteHandler<TBody, TParams, TQuery, TResponse>
  config?: {
    rateLimit?: {
      max: number
      timeWindow: string
    }
    auth?: boolean
    roles?: string[]
  }
}

// Authenticated route options
export interface AuthenticatedRouteOptions<TBody = unknown, TParams = unknown, TQuery = unknown, TResponse = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  url: string
  schema?: RouteSchema
  preHandler?: AuthenticatedPreHandler | AuthenticatedPreHandler[]
  handler: AuthenticatedRouteHandler<TBody, TParams, TQuery, TResponse>
  config?: {
    rateLimit?: {
      max: number
      timeWindow: string
    }
    auth?: boolean
    roles?: string[]
  }
}

// =============================================================================
// ERROR TYPES
// =============================================================================

// Enhanced error type for Fastify
export interface FastifyError extends Error {
  statusCode?: number
  code?: string
  validation?: Array<{
    field: string
    message: string
    code: string
  }>
  details?: unknown
}

// =============================================================================
// PLUGIN TYPES
// =============================================================================

// Plugin options interface
export interface PluginOptions {
  [key: string]: unknown
}

// Plugin function type
export type FastifyPlugin<T extends PluginOptions = PluginOptions> = (
  fastify: FastifyInstance,
  options: T
) => Promise<void>

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Extract body type from route schema
export type ExtractBody<T> = T extends { body: infer B } ? B : never

// Extract params type from route schema
export type ExtractParams<T> = T extends { params: infer P } ? P : never

// Extract query type from route schema
export type ExtractQuery<T> = T extends { querystring: infer Q } ? Q : never

// Extract response type from route schema
export type ExtractResponse<T> = T extends { response: { 200: infer R } } ? R : never

// =============================================================================
// CONTEXT TYPES
// =============================================================================

// Request context for logging and tracing
export interface RequestContext {
  requestId: string
  userId?: string
  method: string
  url: string
  userAgent?: string
  ip: string
  timestamp: string
  startTime: number
}

// Response context
export interface ResponseContext extends RequestContext {
  statusCode: number
  responseTime: number
  contentLength?: number
}
