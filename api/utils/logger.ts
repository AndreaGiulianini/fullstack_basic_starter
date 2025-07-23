import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { ENVIRONMENT, TIMEOUTS } from './constants'

// =============================================================================
// LOGGER CONFIGURATION
// =============================================================================

// Determine log level based on environment
const getLogLevel = (): pino.Level => {
  const env = process.env.ENV || ENVIRONMENT.DEVELOPMENT
  switch (env) {
    case ENVIRONMENT.PRODUCTION:
      return 'info'
    case ENVIRONMENT.DEVELOPMENT:
      return 'debug'
    default:
      return 'trace'
  }
}

// Configure Elasticsearch stream if available
const createElasticsearchStream = () => {
  if (!process.env.ELASTICSEARCH_HOST || !process.env.ELASTICSEARCH_PORT) {
    return null
  }

  return pinoElastic({
    index: 'api-logs',
    node: `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
    opType: 'index',
    esVersion: 8,
    flushBytes: TIMEOUTS.ELASTICSEARCH_FLUSH_BYTES,
    auth: process.env.ELASTICSEARCH_AUTH
      ? {
          username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
          password: process.env.ELASTICSEARCH_PASSWORD || ''
        }
      : undefined
  })
}

// =============================================================================
// LOGGER SETUP
// =============================================================================

const level = getLogLevel()
const elasticsearchStream = createElasticsearchStream()

// Create streams array
const streams: pino.StreamEntry[] = [
  {
    level: level,
    stream: process.stdout
  }
]

// Add Elasticsearch stream if configured
if (elasticsearchStream) {
  streams.push({
    level: level,
    stream: elasticsearchStream
  })
}

// Create logger instance
const logger = pino(
  {
    level,
    ...ecsFormat,
    // Add custom fields
    base: {
      service: 'api',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.ENV || ENVIRONMENT.DEVELOPMENT
    },
    // Format timestamps
    timestamp: pino.stdTimeFunctions.isoTime,
    // Add request ID to all logs
    formatters: {
      level: (label) => ({ level: label }),
      log: (object) => {
        // Add correlation ID if available
        if (object.requestId) {
          return { ...object, correlationId: object.requestId }
        }
        return object
      }
    }
  },
  pino.multistream(streams)
)

// =============================================================================
// ERROR HANDLING FOR ELASTICSEARCH
// =============================================================================

if (elasticsearchStream) {
  // Handle Elasticsearch connection errors
  elasticsearchStream.on('error', (error) => {
    console.error('Elasticsearch client error:', error)
  })

  // Handle Elasticsearch insertion errors
  elasticsearchStream.on('insertError', (error) => {
    console.error('Elasticsearch server error:', error)
  })

  // Handle successful connections
  elasticsearchStream.on('connect', () => {
    console.log('Connected to Elasticsearch for logging')
  })
}

// =============================================================================
// LOGGING UTILITIES
// =============================================================================

// Structured logging helpers
const logUtils = {
  // Log API requests
  logRequest: (requestData: {
    method: string
    url: string
    userAgent?: string
    ip?: string
    userId?: string
    requestId?: string
  }) => {
    logger.info(
      {
        eventType: 'api_request',
        ...requestData
      },
      `${requestData.method} ${requestData.url}`
    )
  },

  // Log API responses
  logResponse: (responseData: {
    method: string
    url: string
    statusCode: number
    responseTime: number
    userId?: string
    requestId?: string
  }) => {
    logger.info(
      {
        eventType: 'api_response',
        ...responseData
      },
      `${responseData.method} ${responseData.url} - ${responseData.statusCode} (${responseData.responseTime}ms)`
    )
  },

  // Log authentication events
  logAuth: (authData: {
    event: 'login' | 'logout' | 'register' | 'password_reset' | 'email_verify'
    userId?: string
    email?: string
    ip?: string
    userAgent?: string
    success: boolean
    reason?: string
  }) => {
    const logLevel = authData.success ? 'info' : 'warn'
    logger[logLevel](
      {
        eventType: `auth_${authData.event}`,
        ...authData
      },
      `Authentication ${authData.event}: ${authData.success ? 'SUCCESS' : 'FAILED'}`
    )
  },

  // Log database operations
  logDatabase: (dbData: {
    operation: 'create' | 'read' | 'update' | 'delete'
    table: string
    userId?: string
    recordId?: string
    duration?: number
    success: boolean
    error?: string
  }) => {
    const logLevel = dbData.success ? 'debug' : 'error'
    logger[logLevel](
      {
        eventType: 'database_operation',
        ...dbData
      },
      `Database ${dbData.operation} on ${dbData.table}: ${dbData.success ? 'SUCCESS' : 'FAILED'}`
    )
  },

  // Log security events
  logSecurity: (securityData: {
    event: 'rate_limit' | 'suspicious_activity' | 'access_denied' | 'data_breach'
    userId?: string
    ip?: string
    userAgent?: string
    details?: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }) => {
    logger.warn(
      {
        eventType: 'security_event',
        ...securityData
      },
      `Security event: ${securityData.event}`
    )
  },

  // Log performance metrics
  logPerformance: (perfData: {
    operation: string
    duration: number
    memoryUsage?: number
    cpuUsage?: number
    requestId?: string
  }) => {
    logger.debug(
      {
        eventType: 'performance_metric',
        ...perfData
      },
      `Performance: ${perfData.operation} took ${perfData.duration}ms`
    )
  },

  // Log business events
  logBusiness: (businessData: {
    event: string
    userId?: string
    entityType?: string
    entityId?: string
    action?: string
    metadata?: Record<string, unknown>
  }) => {
    logger.info(
      {
        eventType: 'business_event',
        ...businessData
      },
      `Business event: ${businessData.event}`
    )
  }
}

// =============================================================================
// HEALTH CHECK LOGGING
// =============================================================================

// Log application startup
const logStartup = (port: number, host: string) => {
  logger.info(
    {
      eventType: 'app_startup',
      port,
      host,
      nodeVersion: process.version,
      platform: process.platform
    },
    `Server started on ${host}:${port}`
  )
}

// Log application shutdown
const logShutdown = (reason?: string) => {
  logger.info(
    {
      eventType: 'app_shutdown',
      reason
    },
    'Server shutting down'
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default logger
export { logUtils, logStartup, logShutdown }
