import type { InferSelectModel } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { FastifyRequest } from 'fastify'
import type { account, session, user, verification } from './database'

// =============================================================================
// DATABASE TYPES
// All TypeScript types inferred from database schemas
// =============================================================================

/**
 * User entity type (inferred from Drizzle schema)
 */
export type User = InferSelectModel<typeof user>

/**
 * Session entity type (inferred from Drizzle schema)
 */
export type Session = InferSelectModel<typeof session>

/**
 * Account entity type (inferred from Drizzle schema)
 */
export type Account = InferSelectModel<typeof account>

/**
 * Verification entity type (inferred from Drizzle schema)
 */
export type Verification = InferSelectModel<typeof verification>

// =============================================================================
// DATABASE INSTANCE TYPES
// =============================================================================

/**
 * Complete database schema type for Drizzle instance
 */
export type DatabaseSchema = {
  user: typeof user
  session: typeof session
  account: typeof account
  verification: typeof verification
}

/**
 * Database connection instance type
 */
export type DatabaseInstance = NodePgDatabase<DatabaseSchema>

// =============================================================================
// API RESPONSE TYPES
// Clean types for API responses (without sensitive data)
// =============================================================================

/**
 * Safe user type for API responses (no emailVerified)
 */
export type SafeUser = Omit<User, 'emailVerified'>

/**
 * API-optimized user type with string dates
 */
export type SafeUserApi = Omit<SafeUser, 'createdAt' | 'updatedAt'> & {
  createdAt: string // ISO string format for JSON APIs
}

// =============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// Input types for service operations
// =============================================================================

/**
 * Data required to create a new user
 */
export interface CreateUserData {
  name: string
  email: string
  password: string
}

/**
 * Data for updating user information (all optional)
 */
export interface UpdateUserData {
  name?: string
  email?: string
  image?: string
}

/**
 * Data required to create a new session
 */
export interface CreateSessionData {
  token: string
  userId: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
}

// =============================================================================
// AUTHENTICATION TYPES
// Better-Auth related types
// =============================================================================

/**
 * Better-Auth session structure
 */
export interface BetterAuthSession {
  user: {
    id: string
    email: string
    name: string | null
  }
  session: {
    id: string
    expiresAt: Date
  }
}

/**
 * Authenticated user context
 */
export interface AuthenticatedUser {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
}

/**
 * Profile API response structure
 */
export interface ProfileResponse {
  success: boolean
  data: SafeUserApi
}

// =============================================================================
// VALIDATION TYPES
// Error handling and validation types
// =============================================================================

/**
 * Validation error details
 */
export interface ValidationErrorDetail {
  field: string
  message: string
  code: string
}

/**
 * Standard API error response
 */
export interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
    timestamp: string
    path: string
    details?: ValidationErrorDetail[]
  }
}

/**
 * Standard API success response
 */
export interface SuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

// =============================================================================
// FASTIFY TYPES
// Framework-specific types
// =============================================================================

/**
 * Generic JSON Schema object for Fastify
 */
export interface JsonSchemaObject {
  type?: string
  properties?: Record<string, unknown>
  required?: string[]
  additionalProperties?: boolean
  [key: string]: unknown
}

/**
 * Pre-handler function type for Fastify hooks
 */
export type PreHandlerFunction = (request: unknown, reply: unknown) => Promise<void> | void

/**
 * Simple route handler type
 */
export type SimpleRouteHandler = (request: unknown, reply: unknown) => Promise<unknown> | unknown

/**
 * Extended Fastify request with custom properties
 */
export interface ExtendedFastifyRequest extends FastifyRequest {
  user?: AuthenticatedUser
  requestId?: string
  startTime?: number
}

/**
 * Authenticated Fastify request with user context
 */
export interface AuthenticatedFastifyRequest extends ExtendedFastifyRequest {
  user: AuthenticatedUser
}

/**
 * Route options for Fastify with OpenAPI
 */
export interface RouteOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  schema?: {
    body?: JsonSchemaObject
    params?: JsonSchemaObject
    querystring?: JsonSchemaObject
    response?: { [statusCode: number]: JsonSchemaObject }
    tags?: string[]
    description?: string
    summary?: string
    security?: Array<{ [key: string]: string[] }>
  }
  preHandler?: PreHandlerFunction | PreHandlerFunction[]
  handler: SimpleRouteHandler
}
