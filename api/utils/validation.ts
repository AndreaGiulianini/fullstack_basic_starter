import type { FastifyReply, FastifyRequest } from 'fastify'
import { ERROR_MESSAGES } from '../constants'
import { ValidationError } from '../errors/appError'
import { emailSchema, passwordSchema, uuidSchema } from '../schemas'
import type { ValidationErrorDetail } from '../types/validation'

/**
 * Interface for any schema that can safely parse data
 * Matches Zod's SafeParseResult structure
 */
interface ParseableSchema<T> {
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: unknown }
}

/**
 * Enhanced validation result interface
 */
interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationErrorDetail[]
}

/**
 * Generic validator factory that works with any Zod schema
 */
export const createValidator = <T>(schema: ParseableSchema<T>, errorMessage?: string) => ({
  validate: (data: unknown): T => {
    const result = schema.safeParse(data)
    if (!result.success) {
      throw new ValidationError(errorMessage || ERROR_MESSAGES.INVALID_REQUEST_DATA)
    }
    return result.data
  },
  validateSafe: (data: unknown): ValidationResult<T> => {
    const result = schema.safeParse(data)
    if (result.success) {
      return { success: true, data: result.data }
    }
    return {
      success: false,
      errors: [
        { field: 'unknown', message: errorMessage || ERROR_MESSAGES.INVALID_REQUEST_DATA, code: 'VALIDATION_ERROR' }
      ]
    }
  }
})

/**
 * Centralized route validation helpers with consistent error handling
 */
export const validateBody = <T>(schema: ParseableSchema<T>, body: unknown): T => {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.REQUEST_BODY_VALIDATION_FAILED)
  }
  return result.data
}

export const validateParams = <T>(schema: ParseableSchema<T>, params: unknown): T => {
  const result = schema.safeParse(params)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.REQUEST_PARAMS_VALIDATION_FAILED)
  }
  return result.data
}

export const validateQuery = <T>(schema: ParseableSchema<T>, query: unknown): T => {
  const result = schema.safeParse(query)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.REQUEST_QUERY_VALIDATION_FAILED)
  }
  return result.data
}

/**
 * Enhanced validation middleware factory
 */
export const createValidationMiddleware = <T>(
  schema: ParseableSchema<T>,
  target: 'body' | 'params' | 'query' = 'body'
) => {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const dataToValidate = getDataToValidate(request, target)

    const result = schema.safeParse(dataToValidate)
    if (!result.success) {
      const errorMessage = getErrorMessage(target)
      throw new ValidationError(errorMessage)
    }

    // Attach validated data to request
    attachValidatedData(request, result.data, target)
  }
}

/**
 * Helper function to get data to validate based on target
 */
const getDataToValidate = (request: FastifyRequest, target: 'body' | 'params' | 'query') => {
  switch (target) {
    case 'body':
      return request.body
    case 'params':
      return request.params
    case 'query':
      return request.query
    default:
      return request.body
  }
}

/**
 * Helper function to get appropriate error message
 */
const getErrorMessage = (target: 'body' | 'params' | 'query') => {
  switch (target) {
    case 'body':
      return ERROR_MESSAGES.REQUEST_BODY_VALIDATION_FAILED
    case 'params':
      return ERROR_MESSAGES.REQUEST_PARAMS_VALIDATION_FAILED
    case 'query':
      return ERROR_MESSAGES.REQUEST_QUERY_VALIDATION_FAILED
    default:
      return ERROR_MESSAGES.REQUEST_BODY_VALIDATION_FAILED
  }
}

/**
 * Helper function to attach validated data to request
 */
const attachValidatedData = <T>(request: FastifyRequest, data: T, target: 'body' | 'params' | 'query') => {
  switch (target) {
    case 'body':
      ;(request as FastifyRequest & { validatedBody: T }).validatedBody = data
      break
    case 'params':
      ;(request as FastifyRequest & { validatedParams: T }).validatedParams = data
      break
    case 'query':
      ;(request as FastifyRequest & { validatedQuery: T }).validatedQuery = data
      break
  }
}

/**
 * Enhanced input sanitization with better error handling
 */
export const sanitizeInput = {
  email: (email: string): string => {
    if (typeof email !== 'string') {
      throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT)
    }
    const result = emailSchema.safeParse(email.trim().toLowerCase())
    if (!result.success) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT)
    }
    return result.data
  },

  password: (password: string): string => {
    if (typeof password !== 'string') {
      throw new ValidationError(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
    }
    const result = passwordSchema.safeParse(password)
    if (!result.success) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
    }
    return result.data
  },

  uuid: (uuid: string): string => {
    if (typeof uuid !== 'string') {
      throw new ValidationError(ERROR_MESSAGES.INVALID_UUID_FORMAT)
    }
    const result = uuidSchema.safeParse(uuid.trim())
    if (!result.success) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_UUID_FORMAT)
    }
    return result.data
  },

  name: (name: string): string => {
    if (typeof name !== 'string') {
      throw new ValidationError(ERROR_MESSAGES.NAME_REQUIRED)
    }
    const trimmed = name.trim()
    if (!trimmed) {
      throw new ValidationError(ERROR_MESSAGES.NAME_CANNOT_BE_EMPTY)
    }
    if (trimmed.length > 255) {
      throw new ValidationError(ERROR_MESSAGES.NAME_TOO_LONG)
    }
    return trimmed
  },

  textId: (id: string): string => {
    if (typeof id !== 'string') {
      throw new ValidationError('Invalid ID format')
    }
    const trimmed = id.trim()
    if (!trimmed) {
      throw new ValidationError('ID cannot be empty')
    }
    if (trimmed.length > 255) {
      throw new ValidationError('ID too long')
    }
    return trimmed
  }
} as const

/**
 * Batch validation utility for multiple fields
 */
export const validateMultiple = <T extends Record<string, unknown>>(
  data: T,
  validators: Partial<Record<keyof T, (value: unknown) => unknown>>
): T => {
  const validated = { ...data }
  const errors: ValidationErrorDetail[] = []

  for (const [field, validator] of Object.entries(validators)) {
    if (validator && field in data) {
      try {
        validated[field as keyof T] = validator(data[field as keyof T]) as T[keyof T]
      } catch (error) {
        errors.push({
          field: field,
          message: error instanceof Error ? error.message : 'Validation failed',
          code: 'VALIDATION_ERROR'
        })
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(`Multiple validation errors: ${errors.map((e) => `${e.field}: ${e.message}`).join(', ')}`)
  }

  return validated
}

// Legacy exports for backward compatibility (deprecated - use new validation functions instead)
export const validateEmail = (email: string): string => sanitizeInput.email(email)
export const validatePassword = (password: string): string => sanitizeInput.password(password)
