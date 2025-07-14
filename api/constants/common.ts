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
