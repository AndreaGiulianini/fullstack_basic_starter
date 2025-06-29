// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

// Server Configuration
export const SERVER = {
  PORT: 5000,
  HOST: '0.0.0.0',
  LOCALHOST: 'localhost'
} as const

// Security Configuration
export const SECURITY = {
  JWT_SECRET: 'superdupersecret', // TODO: Move to environment variable
  BCRYPT_SALT_ROUNDS: 10,
  TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d'
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

// Error Messages (consolidate all error messages here)
export const ERROR_MESSAGES = {
  // Generic errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_REQUEST_DATA: 'Invalid request data',
  AUTHENTICATION_FAILED: 'Authentication failed',
  ACCESS_DENIED: 'Access denied',
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',
  UNEXPECTED_ERROR_OCCURRED: 'An unexpected error occurred',

  // Validation errors
  REQUEST_BODY_VALIDATION_FAILED: 'Request body validation failed',
  REQUEST_PARAMS_VALIDATION_FAILED: 'Request params validation failed',
  REQUEST_QUERY_VALIDATION_FAILED: 'Request query validation failed',

  // JWT errors
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',

  // Response messages
  SUCCESS_RESPONSE_MESSAGE: 'pong',

  // Legacy messages (to maintain compatibility)
  SERVER_RUNNING: 'Server is running',
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  INVALID_PASSWORD_FORMAT: 'Invalid password format',
  INVALID_UUID_FORMAT: 'Invalid UUID format',
  INVALID_DATE_FORMAT: 'Invalid date format',
  INVALID_BOOLEAN_VALUE: 'Invalid boolean value',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_LONG: 'Name too long',
  NAME_CANNOT_BE_EMPTY: 'Name cannot be empty',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  DATABASE_OPERATION_FAILED: 'Database operation failed',
  FAILED_TO_CREATE_USER: 'Failed to create user'
} as const

// JWT Error Names
export const JWT_ERROR_NAMES = {
  JSON_WEB_TOKEN_ERROR: 'JsonWebTokenError',
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError'
} as const

// Cache Keys (Redis/Valkey)
export const CACHE_KEYS = {
  REFRESH_TOKEN_PREFIX: 'refresh_',
  TEST_KEY: 'test',
  TEST_VALUE: 'ping'
} as const

// Timeouts and Delays
export const TIMEOUTS = {
  IDENTITY_COUNT_DELAY: 700, // ms
  DEFAULT_TIMEOUT: 5000, // 5 seconds
  ELASTICSEARCH_FLUSH_BYTES: 1000
} as const

// Default Ports
export const DEFAULT_PORTS = {
  VALKEY: 5000,
  ELASTICSEARCH: 9200
} as const

// Database Limits
export const DB_LIMITS = {
  DEFAULT_DB_INDEX: 0
} as const

// Database Configuration
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

// User Enums
export const USER_ENUMS = {
  ROLES: ['admin', 'user'] as const,
  STATUSES: ['active', 'inactive', 'banned'] as const,
  SORT_FIELDS: ['name', 'email', 'createdAt'] as const,
  THEMES: ['light', 'dark', 'auto'] as const,
  LANGUAGES: ['en', 'it', 'es', 'fr', 'de'] as const
} as const

// Default Values
export const DEFAULTS = {
  USER_ROLE: 'user',
  USER_STATUS: 'active',
  USER_THEME: 'auto',
  USER_LANGUAGE: 'en',
  USER_TIMEZONE: 'UTC',
  SORT_BY: 'createdAt',
  PAGE_SIZE: 10,
  PAGE_NUMBER: 1
} as const

// Field Names
export const FIELD_NAMES = {
  ID: 'id',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  NAME: 'name'
} as const

// Boolean String Values
export const BOOLEAN_STRINGS = {
  TRUE_VALUES: ['true', '1', 'yes', 'on'] as const,
  FALSE_VALUES: ['false', '0', 'no', 'off'] as const
} as const

// Environment
export const ENVIRONMENT = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
} as const

// API Documentation
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

// Security Definitions
export const SECURITY_DEFINITIONS = {
  BEARER_AUTH: {
    TYPE: 'apiKey',
    NAME: 'Authorization',
    IN: 'header',
    DESCRIPTION: 'Enter JWT Bearer token **_only_**'
  }
} as const

// Legacy constants (keep for backward compatibility but consider deprecated)
export const ERROR_CODES = {
  // Authentication & Authorization
  AUTH_FAILED: 'AUTH_001',
  INSUFFICIENT_PERMISSIONS: 'AUTH_002',
  INVALID_CREDENTIALS: 'AUTH_003',
  TOKEN_EXPIRED: 'AUTH_004',
  INVALID_TOKEN: 'AUTH_005',

  // Validation
  VALIDATION_FAILED: 'VAL_001',
  SCHEMA_VALIDATION_FAILED: 'VAL_002',
  INVALID_REQUEST_FORMAT: 'VAL_003',

  // Resources
  RESOURCE_NOT_FOUND: 'RES_001',
  RESOURCE_CONFLICT: 'RES_002',
  RESOURCE_FORBIDDEN: 'RES_003',

  // Database
  DATABASE_ERROR: 'DB_001',
  DATABASE_CONNECTION_ERROR: 'DB_002',

  // Business Logic
  BUSINESS_LOGIC_ERROR: 'BL_001',

  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXT_001',

  // Rate Limiting
  RATE_LIMIT_ERROR: 'RL_001',

  // File Operations
  FILE_UPLOAD_ERROR: 'FILE_001',
  FILE_SIZE_ERROR: 'FILE_002',
  UNSUPPORTED_FILE_TYPE: 'FILE_003',

  // Internal
  INTERNAL_ERROR: 'INTERNAL_001',

  // Generic
  VALIDATION_ERROR: 'validation_error'
} as const

// Legacy error names
export const ERROR_NAMES = {
  FASTIFY_ERROR: 'FastifyError',
  JWT_ERROR: 'JsonWebTokenError',
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
  ZOD_ERROR: 'ZodError'
} as const

// Legacy database error keywords
export const DB_ERROR_KEYWORDS = ['database', 'connection', 'SQLITE', 'PostgreSQL', 'MySQL'] as const

// Legacy logging config
export const LOGGING = {
  LEVEL: 'trace',
  ELASTICSEARCH: {
    INDEX: 'info',
    OP_TYPE: 'index',
    ES_VERSION: 8,
    FLUSH_BYTES: 1000
  }
} as const

// Legacy messages (use ERROR_MESSAGES instead)
export const MESSAGES = ERROR_MESSAGES
