import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { BETTER_AUTH_ERROR_NAMES, ERROR_MESSAGES, HTTP_STATUS } from '../constants'
import { AppError } from '../errors/appError'
import type { ErrorResponse } from '../types/common'
import type { AuthenticatedFastifyRequest } from '../types/fastify'
import type { ValidationDetails } from '../types/validation'

// Enhanced error interface with more context
interface ErrorWithStatusCode extends Error {
  statusCode?: number
  code?: string
  validation?: unknown[]
  details?: unknown
}

// Enhanced error context interface
interface ErrorContext {
  requestId?: string
  userId?: string
  method: string
  url: string
  userAgent?: string
  ip?: string
  timestamp: string
}

// Generate unique request ID for tracing
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Extract error context from request
const extractErrorContext = (request: FastifyRequest): ErrorContext => {
  return {
    requestId: generateRequestId(),
    userId: (request as AuthenticatedFastifyRequest).user?.id,
    method: request.method,
    url: request.url,
    userAgent: request.headers['user-agent'],
    ip: request.ip,
    timestamp: new Date().toISOString()
  }
}

// Enhanced error logging with structured data
const logError = (error: Error, context: ErrorContext, request: FastifyRequest): void => {
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && { statusCode: error.statusCode }),
      ...(error instanceof ZodError && { validationErrors: error.issues })
    },
    context,
    request: {
      headers: request.headers,
      params: request.params,
      query: request.query,
      // Don't log sensitive data like passwords
      body: request.method !== 'GET' ? '[REDACTED]' : undefined
    }
  }

  // Log at appropriate level based on error type
  if (error instanceof AppError && error.statusCode < 500) {
    request.log.warn(logData, 'Client error occurred')
  } else {
    request.log.error(logData, 'Server error occurred')
  }
}

// Format validation errors for better user experience
const formatValidationErrors = (error: ZodError): string => {
  const errors = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
  return `Validation failed: ${errors}`
}

export const errorHandler = async (error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const context = extractErrorContext(request)

  // Log error with full context
  logError(error, context, request)

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  let details: ValidationDetails | undefined

  // Enhanced error type handling
  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
  } else if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST
    message = formatValidationErrors(error)
    details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code
    }))
  } else if (
    error.name === BETTER_AUTH_ERROR_NAMES.INVALID_SESSION ||
    error.name === BETTER_AUTH_ERROR_NAMES.EXPIRED_SESSION
  ) {
    statusCode = HTTP_STATUS.UNAUTHORIZED
    message = ERROR_MESSAGES.AUTHENTICATION_FAILED
  } else if ('statusCode' in error && typeof (error as ErrorWithStatusCode).statusCode === 'number') {
    statusCode = (error as ErrorWithStatusCode).statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    message = error.message
    details = (error as ErrorWithStatusCode).details as ValidationDetails
  } else if (process.env.ENV !== 'production') {
    // In development, show original error message
    message = error.message
  }

  // Enhanced error response with context
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code: error.name || 'UNKNOWN_ERROR',
      statusCode,
      timestamp: context.timestamp,
      path: context.url
    }
  }

  // Add optional properties conditionally
  if (details) {
    response.error.details = details
  }

  if (process.env.ENV !== 'production') {
    ;(response.error as ErrorResponse['error'] & { requestId?: string }).requestId = context.requestId
  }

  // Set security headers
  reply.header('X-Content-Type-Options', 'nosniff')
  reply.header('X-Frame-Options', 'DENY')
  reply.header('X-XSS-Protection', '1; mode=block')

  return reply.status(statusCode).send(response)
}

export const errorHandlerPlugin = async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(errorHandler)

  // Add request ID to all requests for tracing
  fastify.addHook('onRequest', async (request) => {
    ;(request as AuthenticatedFastifyRequest).requestId = generateRequestId()
  })

  // Add response time tracking
  fastify.addHook('onResponse', async (request, reply) => {
    const responseTime = Date.now() - ((request as AuthenticatedFastifyRequest).startTime || 0)
    request.log.info(
      {
        requestId: (request as AuthenticatedFastifyRequest).requestId,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: `${responseTime}ms`
      },
      'Request completed'
    )
  })

  // Track request start time
  fastify.addHook('onRequest', async (request) => {
    ;(request as AuthenticatedFastifyRequest).startTime = Date.now()
  })
}

export default errorHandlerPlugin
