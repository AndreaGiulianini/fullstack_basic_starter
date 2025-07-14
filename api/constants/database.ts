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
