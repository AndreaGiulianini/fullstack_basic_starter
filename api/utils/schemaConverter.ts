import type { ZodSchema } from 'zod'
import * as z from 'zod'

// =============================================================================
// UNIFIED SCHEMA SYSTEM - ZOD V4 NATIVE
// Zod as single source of truth → auto-convert to JSON Schema for OpenAPI
// Using Zod v4 native JSON Schema conversion (no external dependencies!)
// =============================================================================

/**
 * Convert Zod schema to Fastify-compatible JSON Schema
 * This ensures documentation and validation are always in sync
 * Uses Zod v4 native z.toJSONSchema() method - zero dependencies!
 */
export const zodToFastifySchema = (schema: ZodSchema): object => {
  // Use Zod v4 native JSON Schema conversion
  const jsonSchema = z.toJSONSchema(schema)

  // Clean up the schema for Fastify compatibility
  const { $schema: _$schema, ...cleanSchema } = jsonSchema as Record<string, unknown>

  return cleanSchema
}

/**
 * Create a route schema object from Zod schemas
 * This is the main function to use in routes
 * Zero external dependencies - pure Zod v4!
 */
export const createRouteSchema = (schemas: {
  body?: ZodSchema
  params?: ZodSchema
  querystring?: ZodSchema
  response?: { [statusCode: number]: ZodSchema }
  tags?: string[]
  description?: string
  summary?: string
  security?: Array<{ [key: string]: string[] }>
}) => {
  const routeSchema: Record<string, unknown> = {}

  // Convert each schema type using native Zod conversion
  if (schemas.body) {
    routeSchema.body = zodToFastifySchema(schemas.body)
  }

  if (schemas.params) {
    routeSchema.params = zodToFastifySchema(schemas.params)
  }

  if (schemas.querystring) {
    routeSchema.querystring = zodToFastifySchema(schemas.querystring)
  }

  if (schemas.response) {
    routeSchema.response = {}
    for (const [statusCode, schema] of Object.entries(schemas.response)) {
      ;(routeSchema.response as Record<string, unknown>)[statusCode] = zodToFastifySchema(schema)
    }
  }

  // Add OpenAPI metadata
  if (schemas.tags) {
    routeSchema.tags = schemas.tags
  }
  if (schemas.description) {
    routeSchema.description = schemas.description
  }
  if (schemas.summary) {
    routeSchema.summary = schemas.summary
  }
  if (schemas.security) {
    routeSchema.security = schemas.security
  }

  return routeSchema
}

/**
 * Type-safe route schema creation with IntelliSense
 * Pure Zod v4 implementation with zero external dependencies
 */
export const createTypedRouteSchema = <
  TBody extends ZodSchema | undefined = undefined,
  TParams extends ZodSchema | undefined = undefined,
  TQuery extends ZodSchema | undefined = undefined,
  TResponse extends Record<number, ZodSchema> | undefined = undefined
>(schemas: {
  body?: TBody
  params?: TParams
  querystring?: TQuery
  response?: TResponse
  tags?: string[]
  description?: string
  summary?: string
  security?: Array<{ [key: string]: string[] }>
}) => {
  return createRouteSchema(schemas)
}
