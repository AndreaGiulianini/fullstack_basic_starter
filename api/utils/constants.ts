// =============================================================================
// APPLICATION CONSTANTS
// Consolidated constants for the entire application
// =============================================================================

// =============================================================================
// SERVER CONFIGURATION
// =============================================================================

export const SERVER = {
  PORT: 5000,
  HOST: '0.0.0.0',
  LOCALHOST: 'localhost'
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const BASE_URL = process.env.BASE_URL || 'http://localhost'

export const API_DOCS = {
  TITLE: 'Fastify API',
  DESCRIPTION: 'API documentation for Fastify project',
  VERSION: '1.0.0',
  SCHEMES: ['http'] as const,
  CONSUMES: 'application/json',
  PRODUCES: 'application/json',
  REFERENCE_ROUTE: '/reference',
  THEME: 'fastify'
} as const

export const SECURITY_DEFINITIONS = {
  BEARER_AUTH: {
    TYPE: 'apiKey',
    NAME: 'Authorization',
    IN: 'header',
    DESCRIPTION: 'Enter Bearer token **_only_**'
  }
} as const

// =============================================================================
// DATABASE CONFIGURATION
// =============================================================================

export const DATABASE = {
  DIALECT: 'postgresql',
  TABLE_NAMES: {
    USERS: 'users'
  },
  COLUMN_NAMES: {
    ID: 'id',
    NAME: 'name',
    EMAIL: 'email',
    PASSWORD: 'password',
    CREATED_AT: 'created_at'
  },
  CONSTRAINTS: {
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_MAX_LENGTH: 100,
    NAME_MAX_LENGTH: 255
  }
} as const

// =============================================================================
// SECURITY CONFIGURATION
// =============================================================================

export const SECURITY = {
  BCRYPT_SALT_ROUNDS: 10,
  JWT_EXPIRY: '7d',
  SESSION_EXPIRY: 60 * 60 * 24 * 7, // 7 days in seconds
  REFRESH_TOKEN_EXPIRY: 60 * 60 * 24 * 30, // 30 days in seconds
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 // 15 minutes in seconds
} as const

// Cache keys for Redis/Valkey
export const CACHE_KEYS = {
  TEST_KEY: 'test',
  TEST_VALUE: 'ping',
  USER_SESSION: (userId: string) => `user:session:${userId}`,
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  LOGIN_ATTEMPTS: (email: string) => `auth:attempts:${email}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,
  HEALTH_CHECK: 'app:health'
} as const

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_REQUEST_DATA: 'Invalid request data',
  AUTHENTICATION_FAILED: 'Authentication failed',
  ACCESS_DENIED: 'Access denied',
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_UPDATE_FAILED: 'Failed to update user',
  EMAIL_ALREADY_IN_USE: 'Email already in use',
  INVALID_CREDENTIALS: 'Invalid credentials',
  DATABASE_OPERATION_FAILED: 'Database operation failed',
  REQUEST_BODY_VALIDATION_FAILED: 'Request body validation failed',
  REQUEST_PARAMS_VALIDATION_FAILED: 'Request params validation failed',
  REQUEST_QUERY_VALIDATION_FAILED: 'Request query validation failed',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  SUCCESS_RESPONSE_MESSAGE: 'pong',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_SESSION_DATA: 'Invalid session data',
  AUTHENTICATION_FAILED_GENERIC: 'Authentication failed',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  INVALID_USER_ID: 'Invalid user ID'
} as const

export const BETTER_AUTH_ERROR_NAMES = {
  INVALID_SESSION: 'InvalidSession',
  EXPIRED_SESSION: 'ExpiredSession'
} as const

// =============================================================================
// COMMON UTILITIES
// =============================================================================

export const BOOLEAN_STRINGS = ['true', 'false', '1', '0', 'yes', 'no'] as const

export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
} as const

export const TIMEOUTS = {
  DEFAULT: 5000,
  LONG: 30000,
  DATABASE: 10000,
  IDENTITY_COUNT_DELAY: 1000,
  ELASTICSEARCH_FLUSH_BYTES: 100
} as const

// =============================================================================
// DATABASE QUERY LIMITS
// =============================================================================

export const DB_QUERY_LIMITS = {
  SINGLE_RECORD: 1,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_OFFSET: 0,
  MAX_PAGE_SIZE: 100
} as const

// =============================================================================
// VALIDATION PATTERNS
// =============================================================================

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const

// =============================================================================
// DATABASE AND CONNECTION LIMITS
// =============================================================================

export const DB_LIMITS = {
  MAX_CONNECTIONS: 20,
  CONNECTION_TIMEOUT: 30000,
  QUERY_TIMEOUT: 5000,
  DEFAULT_DB_INDEX: 0
} as const

export const DEFAULT_PORTS = {
  POSTGRES: 5432,
  REDIS: 6379,
  VALKEY: 6379,
  ELASTICSEARCH: 9200
} as const
