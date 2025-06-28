import { ValidationError } from '../errors/appError'
import { emailSchema, passwordSchema, uuidSchema } from '../schemas'

/**
 * Validates an email using Zod schema
 */
export const validateEmail = (email: string): string => {
  const result = emailSchema.safeParse(email)
  if (!result.success) {
    throw new ValidationError(
      'Invalid email format',
      result.error.issues.map((issue) => ({
        field: 'email',
        message: issue.message,
        code: issue.code || 'validation_error'
      }))
    )
  }
  return result.data
}

/**
 * Validates a password using Zod schema
 */
export const validatePassword = (password: string): string => {
  const result = passwordSchema.safeParse(password)
  if (!result.success) {
    throw new ValidationError(
      'Invalid password format',
      result.error.issues.map((issue) => ({
        field: 'password',
        message: issue.message,
        code: issue.code || 'validation_error'
      }))
    )
  }
  return result.data
}

/**
 * Validates a UUID using Zod schema
 */
export const validateUUID = (uuid: string, fieldName = 'id'): string => {
  const result = uuidSchema.safeParse(uuid)
  if (!result.success) {
    throw new ValidationError(
      `Invalid ${fieldName} format`,
      result.error.issues.map((issue) => ({
        field: fieldName,
        message: issue.message,
        code: issue.code || 'validation_error'
      }))
    )
  }
  return result.data
}

/**
 * Handles validation errors and converts them to standardized format
 */
const handleValidationError = (
  error: unknown,
  field: string
): Array<{ field: string; message: string; code: string }> => {
  if (error instanceof ValidationError && error.details) {
    return processValidationErrorDetails(error, field)
  }

  return [
    {
      field,
      message: error instanceof Error ? error.message : 'Validation failed',
      code: 'validation_error'
    }
  ]
}

/**
 * Processes ValidationError details into standardized format
 */
const processValidationErrorDetails = (
  error: ValidationError,
  field: string
): Array<{ field: string; message: string; code: string }> => {
  if (Array.isArray(error.details)) {
    return error.details
  }

  if (typeof error.details === 'string') {
    return [
      {
        field,
        message: error.details,
        code: 'validation_error'
      }
    ]
  }

  // Handle ZodValidationDetails or SchemaValidationDetails
  return [
    {
      field,
      message: error.message,
      code: 'validation_error'
    }
  ]
}

/**
 * Validates a single field with its validator
 */
const validateSingleField = <T extends Record<string, unknown>>(
  field: string,
  validator: (value: unknown) => unknown,
  data: T,
  validatedData: T
): Array<{ field: string; message: string; code: string }> => {
  try {
    validatedData[field as keyof T] = validator(data[field as keyof T]) as T[keyof T]
    return []
  } catch (error) {
    return handleValidationError(error, field)
  }
}

/**
 * Validates multiple fields at once
 */
export const validateFields = <T extends Record<string, unknown>>(
  data: T,
  validators: Partial<Record<keyof T, (value: unknown) => unknown>>
): T => {
  const validatedData = { ...data }
  const errors: Array<{ field: string; message: string; code: string }> = []

  for (const [field, validator] of Object.entries(validators)) {
    if (validator && field in data) {
      const fieldErrors = validateSingleField(field, validator, data, validatedData)
      errors.push(...fieldErrors)
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed for multiple fields', errors)
  }

  return validatedData
}

/**
 * Sanitizes and validates common input data
 */
export const sanitizeInput = {
  email: (email: string) => validateEmail(email.trim().toLowerCase()),
  password: (password: string) => validatePassword(password),
  uuid: (uuid: string, fieldName?: string) => validateUUID(uuid.trim(), fieldName),
  name: (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
      throw new ValidationError('Name cannot be empty')
    }
    if (trimmed.length > 255) {
      throw new ValidationError('Name is too long')
    }
    return trimmed
  }
}
