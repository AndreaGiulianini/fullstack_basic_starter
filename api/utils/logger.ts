import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import pinoPretty from 'pino-pretty'
import { ENVIRONMENT, TIMEOUTS } from './constants'

// Determine log level based on environment
const env = process.env.ENV || ENVIRONMENT.DEVELOPMENT

// Logger configuration
const loggerConfig = {
  levels: {
    [ENVIRONMENT.PRODUCTION]: 'info',
    [ENVIRONMENT.DEVELOPMENT]: 'debug',
    default: 'trace'
  } as const,
  prettyPrint: {
    development: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
      hideObject: false,
      messageFormat: '{msg}',
      customPrettifiers: {
        time: (inputData: string | object) => {
          const timestamp = typeof inputData === 'string' ? inputData : String(inputData)
          return `🕐 ${timestamp}`
        },
        level: (inputData: string | object) => {
          const logLevel = typeof inputData === 'string' ? inputData : String(inputData)
          return `${logLevel.toUpperCase()}`
        }
      }
    }
  }
} as const

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

const level = (loggerConfig.levels[env as keyof typeof loggerConfig.levels] ||
  loggerConfig.levels.default) as pino.Level

const elasticsearchStream = createElasticsearchStream()

const streams: pino.StreamEntry[] = [
  {
    level,
    stream: env === ENVIRONMENT.DEVELOPMENT ? pinoPretty(loggerConfig.prettyPrint.development) : process.stdout
  }
]

// Add Elasticsearch stream if configured
if (elasticsearchStream) {
  streams.push({
    level,
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
      environment: env
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
  // Create a fallback logger for Elasticsearch errors (avoiding circular logging)
  const fallbackLogger = pino({ level: 'error' }, process.stderr)

  // Handle Elasticsearch connection errors
  elasticsearchStream.on('error', (error) => {
    fallbackLogger.error({ error, component: 'elasticsearch' }, 'Elasticsearch client error')
  })

  // Handle Elasticsearch insertion errors
  elasticsearchStream.on('insertError', (error) => {
    fallbackLogger.error({ error, component: 'elasticsearch' }, 'Elasticsearch server error')
  })

  // Handle successful connections
  elasticsearchStream.on('connect', () => {
    fallbackLogger.info({ component: 'elasticsearch' }, 'Connected to Elasticsearch for logging')
  })
}

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
// CUSTOM LOGGING METHODS
// =============================================================================

type AuthLogData = {
  event: string
  ip: string
  userAgent?: string
  success: boolean
  reason?: string
  userId?: string
  email?: string
}

type PerformanceLogData = {
  operation: string
  duration: number
  metadata?: Record<string, unknown>
  requestId?: string
  [key: string]: unknown
}

type SecurityLogData = {
  event: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip?: string
  details?: string | Record<string, unknown>
  [key: string]: unknown
}

const logAuth = (data: AuthLogData) => {
  logger.info(
    {
      eventType: 'authentication',
      ...data
    },
    `Auth event: ${data.event} - ${data.success ? 'success' : 'failed'}`
  )
}

const logPerformance = (data: PerformanceLogData) => {
  logger.info(
    {
      eventType: 'performance',
      ...data
    },
    `Performance: ${data.operation} took ${data.duration}ms`
  )
}

const logSecurity = (data: SecurityLogData) => {
  const logLevel = data.severity === 'critical' || data.severity === 'high' ? 'warn' : 'info'
  logger[logLevel](
    {
      eventType: 'security',
      ...data
    },
    `Security event: ${data.event} (${data.severity})`
  )
}

// Create a logger wrapper with custom methods
const logUtils = {
  ...logger,
  logAuth,
  logPerformance,
  logSecurity
}

// =============================================================================
// EXPORTS
// =============================================================================

export default logUtils
export { logStartup, logShutdown }
