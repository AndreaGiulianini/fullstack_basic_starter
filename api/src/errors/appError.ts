import { ERROR_MESSAGES, HTTP_STATUS } from '../constants'

// Classe base per errori personalizzati
export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

// Errori di validazione (400)
export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.INVALID_REQUEST_DATA) {
    super(message, HTTP_STATUS.BAD_REQUEST)
  }
}

// Errori di autenticazione (401)
export class AuthenticationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTHENTICATION_FAILED) {
    super(message, HTTP_STATUS.UNAUTHORIZED)
  }
}

// Errori di autorizzazione (403)
export class AuthorizationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.ACCESS_DENIED) {
    super(message, HTTP_STATUS.FORBIDDEN)
  }
}

// Risorsa non trovata (404)
export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND)
  }
}

// Conflitto (409) - es. email già esistente
export class ConflictError extends AppError {
  constructor(message: string = ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS) {
    super(message, HTTP_STATUS.CONFLICT)
  }
}
