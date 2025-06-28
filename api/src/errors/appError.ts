import { ERROR_CODES, HTTP_STATUS, MESSAGES } from '../constants'
import type { ValidationDetails } from '../types/validation'

export abstract class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errorCode: string

  constructor(message: string, statusCode: number, errorCode: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errorCode = errorCode

    // Maintain proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

// Authentication & Authorization Errors
export class AuthenticationError extends AppError {
  constructor(message: string = MESSAGES.AUTHENTICATION_FAILED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.AUTH_FAILED)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.INSUFFICIENT_PERMISSIONS)
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = MESSAGES.INVALID_CREDENTIALS) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS)
  }
}

export class TokenExpiredError extends AppError {
  constructor(message = 'Token has expired') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED)
  }
}

export class InvalidTokenError extends AppError {
  constructor(message = 'Invalid token') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_TOKEN)
  }
}

// Validation Errors
export class ValidationError extends AppError {
  public readonly details?: ValidationDetails

  constructor(message: string = MESSAGES.VALIDATION_FAILED, details?: ValidationDetails) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_FAILED)
    this.details = details
  }
}

export class SchemaValidationError extends AppError {
  public readonly details?: ValidationDetails

  constructor(message = 'Schema validation failed', details?: ValidationDetails) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.SCHEMA_VALIDATION_FAILED)
    this.details = details
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', message?: string) {
    super(message || `${resource} not found`, HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.RESOURCE_CONFLICT)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access to this resource is forbidden') {
    super(message, 403, 'RES_003')
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message: string = MESSAGES.DATABASE_OPERATION_FAILED) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.DATABASE_ERROR, false)
  }
}

export class DatabaseConnectionError extends AppError {
  constructor(message = 'Database connection failed') {
    super(message, 500, 'DB_002', false)
  }
}

// Business Logic Errors
export class BusinessLogicError extends AppError {
  constructor(message: string, statusCode = 422) {
    super(message, statusCode, 'BL_001')
  }
}

// External Service Errors
export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `External service ${service} is unavailable`, 503, 'EXT_001', false)
  }
}

// Rate Limiting Errors
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RL_001')
  }
}

// File/Upload Errors
export class FileUploadError extends AppError {
  constructor(message = 'File upload failed') {
    super(message, 400, 'FILE_001')
  }
}

export class FileSizeError extends AppError {
  constructor(message = 'File size exceeds limit') {
    super(message, 413, 'FILE_002')
  }
}

export class UnsupportedFileTypeError extends AppError {
  constructor(message = 'Unsupported file type') {
    super(message, 415, 'FILE_003')
  }
}
