import type { FastifyReply } from 'fastify'
import type { ZodSchema } from 'zod/v4'
import { ERROR_MESSAGES } from '../constants'
import { ValidationError } from '../errors/appError'
import type { SuccessResponse } from '../types/common'

/**
 * Validates request body using Zod schema and throws ValidationError if invalid
 */
export const validateBody = <T>(schema: ZodSchema<T>, body: unknown): T => {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.REQUEST_BODY_VALIDATION_FAILED)
  }
  return result.data
}

/**
 * Validates request params using Zod schema and throws ValidationError if invalid
 */
export const validateParams = <T>(schema: ZodSchema<T>, params: unknown): T => {
  const result = schema.safeParse(params)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.REQUEST_PARAMS_VALIDATION_FAILED)
  }
  return result.data
}

/**
 * Validates request query using Zod schema and throws ValidationError if invalid
 */
export const validateQuery = <T>(schema: ZodSchema<T>, query: unknown): T => {
  const result = schema.safeParse(query)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.REQUEST_QUERY_VALIDATION_FAILED)
  }
  return result.data
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
