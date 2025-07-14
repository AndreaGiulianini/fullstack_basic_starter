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

// Better-Auth Error Names
export const BETTER_AUTH_ERROR_NAMES = {
  INVALID_SESSION: 'InvalidSession',
  EXPIRED_SESSION: 'ExpiredSession'
} as const
