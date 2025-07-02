// Security Configuration
export const SECURITY = {
  JWT_SECRET: 'superdupersecret', // TODO: Move to environment variable
  BCRYPT_SALT_ROUNDS: 10,
  TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d'
} as const

// Cache Keys (Redis/Valkey)
export const CACHE_KEYS = {
  REFRESH_TOKEN_PREFIX: 'refresh_',
  TEST_KEY: 'test',
  TEST_VALUE: 'ping'
} as const
