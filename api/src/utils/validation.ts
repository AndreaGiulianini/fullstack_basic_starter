import { ERROR_MESSAGES } from '../constants'
import { ValidationError } from '../errors/appError'
import { emailSchema, passwordSchema, uuidSchema } from '../schemas'

/**
 * Validates an email using Zod schema
 */
export const validateEmail = (email: string): string => {
  const result = emailSchema.safeParse(email)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT)
  }
  return result.data
}

/**
 * Validates a password using Zod schema
 */
export const validatePassword = (password: string): string => {
  const result = passwordSchema.safeParse(password)
  if (!result.success) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
  }
  return result.data
}

/**
 * Validates a UUID using Zod schema
 */
export const validateUUID = (uuid: string, fieldName = 'id'): string => {
  const result = uuidSchema.safeParse(uuid)
  if (!result.success) {
    throw new ValidationError(`Invalid ${fieldName} format`)
  }
  return result.data
}

/**
 * Validates multiple fields at once
 */
export const validateFields = <T extends Record<string, unknown>>(
  data: T,
  validators: Partial<Record<keyof T, (value: unknown) => unknown>>
): T => {
  const validatedData = { ...data }
  const errors: string[] = []

  for (const [field, validator] of Object.entries(validators)) {
    if (validator && field in data) {
      try {
        validatedData[field as keyof T] = validator(data[field as keyof T]) as T[keyof T]
      } catch (error) {
        errors.push(`${field}: ${error instanceof Error ? error.message : 'Validation failed'}`)
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`)
  }

  return validatedData
}

/**
 * Sanitizes and validates common input data
 */
export const sanitizeInput = {
  email: (email: string) => validateEmail(email.trim().toLowerCase()),
  password: (password: string) => validatePassword(password),
  uuid: (uuid: string) => validateUUID(uuid.trim()),
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
}
