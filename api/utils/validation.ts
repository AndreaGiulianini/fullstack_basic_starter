import { ERROR_MESSAGES } from '../constants'
import { ValidationError } from '../errors/appError'
import { emailSchema, passwordSchema, uuidSchema } from '../schemas'

/**
 * Interface for any schema that can safely parse data
 * Matches Zod's SafeParseResult structure
 */
interface ParseableSchema<T> {
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: unknown }
}

/**
 * Generic validator that works with any Zod schema
 */
export const createValidator = <T>(schema: ParseableSchema<T>, errorMessage?: string) => ({
  validate: (data: unknown): T => {
    const result = schema.safeParse(data)
    if (!result.success) {
      throw new ValidationError(errorMessage || ERROR_MESSAGES.INVALID_REQUEST_DATA)
    }
    return result.data
  },
  validateSafe: (data: unknown) => schema.safeParse(data)
})

/**
 * Route validation helpers - unified approach for all validation
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
 * Sanitizes and validates common input data with built-in transformations
 */
export const sanitizeInput = {
  email: (email: string) => {
    const result = emailSchema.safeParse(email.trim().toLowerCase())
    if (!result.success) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT)
    }
    return result.data
  },
  password: (password: string) => {
    const result = passwordSchema.safeParse(password)
    if (!result.success) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
    }
    return result.data
  },
  uuid: (uuid: string) => {
    const result = uuidSchema.safeParse(uuid.trim())
    if (!result.success) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_UUID_FORMAT)
    }
    return result.data
  },
  name: (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
      throw new ValidationError(ERROR_MESSAGES.NAME_CANNOT_BE_EMPTY)
    }
    if (trimmed.length > 255) {
      throw new ValidationError(ERROR_MESSAGES.NAME_TOO_LONG)
    }
    return trimmed
  }
} as const

// Legacy exports for backward compatibility (deprecated - use new validation functions instead)
export const validateEmail = (email: string): string => sanitizeInput.email(email)
export const validatePassword = (password: string): string => sanitizeInput.password(password)
export const validateUUID = (uuid: string, fieldName = 'id'): string => {
  const result = uuidSchema.safeParse(uuid)
  if (!result.success) {
    throw new ValidationError(`Invalid ${fieldName} format`)
  }
  return result.data
}
