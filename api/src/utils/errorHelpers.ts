import { ERROR_MESSAGES, HTTP_STATUS } from '../constants'
import { AppError } from '../errors/appError'

/**
 * Async wrapper che cattura gli errori e li converte in AppError
 */
export const asyncHandler = <T extends readonly unknown[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      // Se è già un AppError, lo rilanciamo
      if (error instanceof AppError) {
        throw error
      }

      // Altrimenti creiamo un errore generico
      if (error instanceof Error) {
        throw new AppError(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
      }

      throw new AppError(ERROR_MESSAGES.UNEXPECTED_ERROR_OCCURRED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }
}

/**
 * Helper per creare dettagli di errore consistenti per il debug
 */
export const createErrorDetails = (error: Error) => {
  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  }
}
