import type { ZodError, ZodSchema } from 'zod'
import { ValidationError } from './appError'

// =============================================================================
// SIMPLIFIED VALIDATION SYSTEM
// Simplified validation system that works natively with Fastify
// =============================================================================

/**
 * Helper for quick validation - use only when necessary
 * Fastify automatically handles validation with schemas in routes
 */
export const validateData = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ValidationError(`Validation failed: ${result.error.message}`)
  }
  return result.data
}

/**
 * Zod error extractor for more user-friendly messages
 */
export const formatZodError = (error: ZodError): string => {
  if (error?.issues) {
    return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
  }
  return error.message || 'Validation error'
}
