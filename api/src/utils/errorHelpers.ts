import { AppError, DatabaseError } from '../errors/appError'

/**
 * Async wrapper that catches errors and converts them to AppError instances
 * This eliminates the need for try-catch blocks in your business logic
 */
export const asyncHandler = <T extends readonly unknown[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error
      }

      // Convert database-related errors
      if (error instanceof Error) {
        if (
          error.message.includes('database') ||
          error.message.includes('connection') ||
          error.message.includes('SQLITE') ||
          error.message.includes('PostgreSQL') ||
          error.message.includes('MySQL')
        ) {
          throw new DatabaseError(error.message)
        }
      }

      // Convert generic errors to DatabaseError if they seem DB-related
      throw new DatabaseError('An unexpected error occurred')
    }
  }
}

/**
 * Wrapper for database operations specifically
 */
export const dbHandler = <T extends readonly unknown[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      if (error instanceof Error) {
        throw new DatabaseError(`Database operation failed: ${error.message}`)
      }

      throw new DatabaseError('Unknown database error occurred')
    }
  }
}

/**
 * Type guard to check if an error is an operational error
 */
export const isOperationalError = (error: Error): error is AppError => {
  return error instanceof AppError && error.isOperational
}

/**
 * Helper to create consistent error responses for debugging
 */
export const createErrorDetails = (error: Error) => {
  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  }
}
