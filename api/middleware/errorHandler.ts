import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import type { ErrorResponse, ExtendedFastifyRequest, ValidationErrorDetail } from '../schemas'
import { AppError } from '../utils/appError'
import { BETTER_AUTH_ERROR_NAMES, ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants'

// =============================================================================
// ERROR INTERFACES
// =============================================================================

interface ErrorWithStatusCode extends Error {
  statusCode?: number
  details?: ValidationErrorDetail[]
}

// =============================================================================
// ERROR CONTEXT EXTRACTION
// =============================================================================

export const extractErrorContext = (request: FastifyRequest) => {
  return {
    url: request.url,
    method: request.method,
    userId: (request as ExtendedFastifyRequest).user?.id || 'anonymous',
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    timestamp: new Date().toISOString()
  }
}

export const logError = (error: Error, context: ReturnType<typeof extractErrorContext>, request: FastifyRequest) => {
  const requestInfo = {
    requestId: request.id,
    userId: (request as ExtendedFastifyRequest).user?.id || 'anonymous',
    userAgent: request.headers['user-agent'],
    ip: request.ip,
    startTime: Date.now()
  }

  request.log.error(
    {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      request: requestInfo,
      context
    },
    'Request failed with error'
  )
}

// =============================================================================
// VALIDATION ERROR FORMATTING
// =============================================================================

const formatValidationErrors = (error: ZodError): string => {
  return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
}

// =============================================================================
// REQUEST ID GENERATION
// =============================================================================

const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// =============================================================================
// USER INFO EXTRACTION
// =============================================================================

// Helper function removed - not used in current implementation

// =============================================================================
// MAIN ERROR HANDLER
// =============================================================================

export const errorHandler = async (error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const context = extractErrorContext(request)

  // Log error with full context
  logError(error, context, request)

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  let details: ValidationErrorDetail[] | undefined

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
    details = (error as ErrorWithStatusCode).details as ValidationErrorDetail[]
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

  // Set status code and send response
  reply.code(statusCode).send(response)
}

// =============================================================================
// ERROR HANDLER PLUGIN
// =============================================================================

const errorHandlerPlugin = async (fastify: FastifyInstance) => {
  // Register the main error handler
  fastify.setErrorHandler(errorHandler)

  // Add request ID to all requests for tracing
  fastify.addHook('onRequest', async (request) => {
    ;(request as ExtendedFastifyRequest).requestId = generateRequestId()
  })

  // Add response time tracking
  fastify.addHook('onResponse', async (request, reply) => {
    const responseTime = Date.now() - ((request as ExtendedFastifyRequest).startTime || 0)
    request.log.info(
      {
        requestId: (request as ExtendedFastifyRequest).requestId,
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
    ;(request as ExtendedFastifyRequest).startTime = Date.now()
  })
}

export default errorHandlerPlugin
