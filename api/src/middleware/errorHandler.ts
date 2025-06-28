import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError, SchemaValidationError, ValidationError } from '../errors/appError'
import type { FastifyError, ValidationDetails } from '../types/validation'

interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
    details?: ValidationDetails
    timestamp: string
    path: string
  }
}

export const errorHandler = async (error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const timestamp = new Date().toISOString()
  const path = request.url

  // Log error for debugging (in production, you might want to use a proper logging service)
  request.log.error({
    error: error.message,
    stack: error.stack,
    path,
    timestamp
  })

  // Handle custom AppError instances
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.errorCode,
        statusCode: error.statusCode,
        timestamp,
        path
      }
    }

    // Add details for validation errors
    if (error instanceof ValidationError || error instanceof SchemaValidationError) {
      response.error.details = error.details
    }

    return reply.status(error.statusCode).send(response)
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VAL_001',
        statusCode: 400,
        details: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code || 'validation_error'
        })),
        timestamp,
        path
      }
    }

    return reply.status(400).send(response)
  }

  // Handle Fastify validation errors
  if (error.name === 'FastifyError' && (error as FastifyError).statusCode === 400) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Invalid request format',
        code: 'VAL_003',
        statusCode: 400,
        timestamp,
        path
      }
    }

    return reply.status(400).send(response)
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Invalid token',
        code: 'AUTH_005',
        statusCode: 401,
        timestamp,
        path
      }
    }

    return reply.status(401).send(response)
  }

  if (error.name === 'TokenExpiredError') {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Token has expired',
        code: 'AUTH_004',
        statusCode: 401,
        timestamp,
        path
      }
    }

    return reply.status(401).send(response)
  }

  // Handle database errors (you might want to customize this based on your DB library)
  if (error.message.includes('database') || error.message.includes('connection')) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Database error occurred',
        code: 'DB_001',
        statusCode: 500,
        timestamp,
        path
      }
    }

    return reply.status(500).send(response)
  }

  // Handle generic errors
  const response: ErrorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      code: 'INTERNAL_001',
      statusCode: 500,
      timestamp,
      path
    }
  }

  return reply.status(500).send(response)
}

// Plugin to register the error handler
export const errorHandlerPlugin = async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(errorHandler)
}

export default errorHandlerPlugin
