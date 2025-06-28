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

// Error Codes
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

// Error Names
export const ERROR_NAMES = {
  FASTIFY_ERROR: 'FastifyError',
  JWT_ERROR: 'JsonWebTokenError',
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
  ZOD_ERROR: 'ZodError'
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

// Database Error Keywords
export const DB_ERROR_KEYWORDS = ['database', 'connection', 'SQLITE', 'PostgreSQL', 'MySQL'] as const

// Environment
export const ENVIRONMENT = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
} as const

// Logging
export const LOGGING = {
  LEVEL: 'trace',
  ELASTICSEARCH: {
    INDEX: 'info',
    OP_TYPE: 'index',
    ES_VERSION: 8,
    FLUSH_BYTES: 1000
  }
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

// Generic Messages
export const MESSAGES = {
  SERVER_RUNNING: 'Server is running',
  VALIDATION_FAILED: 'Validation failed',
  AUTHENTICATION_FAILED: 'Authentication failed',
  UNAUTHORIZED: 'Unauthorized',
  INTERNAL_SERVER_ERROR: 'Internal server error',
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
  RESOURCE_NOT_FOUND: 'Resource not found',
  DATABASE_OPERATION_FAILED: 'Database operation failed',
  FAILED_TO_CREATE_USER: 'Failed to create user'
} as const
