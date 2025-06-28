import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ZodSchema } from 'zod'
import { SchemaValidationError } from '../errors/appError'
import type { SuccessResponse } from '../types/common'

/**
 * Validates request body using Zod schema and throws SchemaValidationError if invalid
 */
export const validateBody = <T>(schema: ZodSchema<T>, body: unknown): T => {
  const result = schema.safeParse(body)
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code || 'validation_error'
    }))
    throw new SchemaValidationError('Request body validation failed', details)
  }
  return result.data
}

/**
 * Validates request params using Zod schema and throws SchemaValidationError if invalid
 */
export const validateParams = <T>(schema: ZodSchema<T>, params: unknown): T => {
  const result = schema.safeParse(params)
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code || 'validation_error'
    }))
    throw new SchemaValidationError('Request params validation failed', details)
  }
  return result.data
}

/**
 * Validates request query using Zod schema and throws SchemaValidationError if invalid
 */
export const validateQuery = <T>(schema: ZodSchema<T>, query: unknown): T => {
  const result = schema.safeParse(query)
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code || 'validation_error'
    }))
    throw new SchemaValidationError('Request query validation failed', details)
  }
  return result.data
}

/**
 * Route handler wrapper that automatically handles errors and sends success responses
 */
export const routeHandler = <TResult = unknown>(
  handler: (request: FastifyRequest, reply: FastifyReply) => Promise<TResult>
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await handler(request, reply)

    // If the result is already sent (reply.sent is true), don't send again
    if (reply.sent) {
      return
    }

    // Send success response
    reply.send({
      success: true,
      data: result
    })
  }
}

/**
 * Creates a success response with consistent format
 */
export const createSuccessResponse = <T>(data: T, message?: string): SuccessResponse<T> => {
  return {
    success: true as const,
    data,
    ...(message && { message })
  }
}

/**
 * Sends a success response
 */
export const sendSuccess = <T>(reply: FastifyReply, data: T, message?: string): FastifyReply => {
  return reply.send(createSuccessResponse(data, message))
}
