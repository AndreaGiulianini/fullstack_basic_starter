import { ValidationError } from './appError'
import { ERROR_MESSAGES } from './constants'
import { emailSchema, nameSchema, passwordSchema } from './schemas'

/**
 * Interface for any schema that can safely parse data
 * Matches Zod's SafeParseResult structure
 */
interface ParseableSchema<T> {
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: unknown }
}

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
 * Input sanitization utilities
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

  name: (name: string): string => {
    if (typeof name !== 'string') {
      throw new ValidationError('Name is required')
    }
    const result = nameSchema.safeParse(name)
    if (!result.success) {
      throw new ValidationError('Invalid name format')
    }
    return result.data
  },

  password: (password: string): string => {
    if (typeof password !== 'string') {
      throw new ValidationError('Password is required')
    }
    const result = passwordSchema.safeParse(password)
    if (!result.success) {
      throw new ValidationError('Invalid password format')
    }
    return result.data
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
