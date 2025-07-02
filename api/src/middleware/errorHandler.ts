import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod/v4'
import { ERROR_MESSAGES, HTTP_STATUS, JWT_ERROR_NAMES } from '../constants'
import { AppError } from '../errors/appError'
import type { ErrorResponse } from '../types/common'

// Tipo per errori che potrebbero avere statusCode
interface ErrorWithStatusCode {
  statusCode?: number
  message: string
}

export const errorHandler = async (error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const timestamp = new Date().toISOString()
  const path = request.url

  // Log dell'errore
  request.log.error({
    error: error.message,
    stack: error.stack,
    path,
    timestamp
  })

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR

  // Gestione semplificata degli errori più comuni
  if (error instanceof AppError) {
    // Errori personalizzati con statusCode
    statusCode = error.statusCode
    message = error.message
  } else if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST
    message = ERROR_MESSAGES.INVALID_REQUEST_DATA
  } else if (
    error.name === JWT_ERROR_NAMES.JSON_WEB_TOKEN_ERROR ||
    error.name === JWT_ERROR_NAMES.TOKEN_EXPIRED_ERROR
  ) {
    statusCode = HTTP_STATUS.UNAUTHORIZED
    message = ERROR_MESSAGES.AUTHENTICATION_FAILED
  } else if ('statusCode' in error && typeof (error as ErrorWithStatusCode).statusCode === 'number') {
    // Se l'errore ha già uno statusCode, lo usiamo
    statusCode = (error as ErrorWithStatusCode).statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    message = error.message
  } else if (process.env.ENV !== 'production') {
    // In sviluppo, mostra il messaggio originale
    message = error.message
  }

  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code: error.name || 'UNKNOWN_ERROR',
      statusCode,
      timestamp,
      path
    }
  }

  return reply.status(statusCode).send(response)
}

export const errorHandlerPlugin = async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(errorHandler)
}

export default errorHandlerPlugin
