// =============================================================================
// SECURITY CONFIGURATION
// =============================================================================

// Authentication and encryption settings
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

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

// Cache keys for Redis/Valkey
export const CACHE_KEYS = {
  // Test keys
  TEST_KEY: 'test',
  TEST_VALUE: 'ping',

  // User-related cache keys
  USER_SESSION: (userId: string) => `user:session:${userId}`,
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_PREFERENCES: (userId: string) => `user:preferences:${userId}`,

  // Authentication cache keys
  LOGIN_ATTEMPTS: (email: string) => `auth:attempts:${email}`,
  PASSWORD_RESET: (token: string) => `auth:reset:${token}`,
  EMAIL_VERIFICATION: (token: string) => `auth:verify:${token}`,

  // API rate limiting
  RATE_LIMIT: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,

  // General application cache
  HEALTH_CHECK: 'app:health',
  CONFIG: 'app:config'
} as const

// =============================================================================
// CACHE TTL (Time To Live) SETTINGS
// =============================================================================

// Cache expiration times in seconds
export const CACHE_TTL = {
  // Short-lived cache (5 minutes)
  SHORT: 5 * 60,

  // Medium-lived cache (1 hour)
  MEDIUM: 60 * 60,

  // Long-lived cache (24 hours)
  LONG: 24 * 60 * 60,

  // User-specific TTLs
  USER_SESSION: 60 * 60 * 24 * 7, // 7 days
  USER_PROFILE: 60 * 60, // 1 hour
  USER_PREFERENCES: 60 * 60 * 24, // 24 hours

  // Auth-specific TTLs
  LOGIN_ATTEMPTS: 60 * 60, // 1 hour
  PASSWORD_RESET: 60 * 15, // 15 minutes
  EMAIL_VERIFICATION: 60 * 60 * 24, // 24 hours

  // Rate limiting TTL
  RATE_LIMIT: 60 * 60 // 1 hour
} as const

// =============================================================================
// RATE LIMITING CONFIGURATION
// =============================================================================

// Rate limit settings for different endpoints
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: { max: 5, window: '15m' },
    REGISTER: { max: 3, window: '15m' },
    PASSWORD_RESET: { max: 3, window: '15m' },
    EMAIL_VERIFY: { max: 10, window: '15m' }
  },

  // API endpoints
  API: {
    GENERAL: { max: 100, window: '15m' },
    UPLOAD: { max: 10, window: '15m' },
    SEARCH: { max: 50, window: '15m' }
  },

  // Admin endpoints
  ADMIN: {
    GENERAL: { max: 200, window: '15m' },
    BULK_OPERATIONS: { max: 5, window: '15m' }
  }
} as const

// =============================================================================
// SECURITY HEADERS
// =============================================================================

// Security headers for HTTP responses
export const SECURITY_HEADERS = {
  CONTENT_TYPE_OPTIONS: 'nosniff',
  FRAME_OPTIONS: 'DENY',
  XSS_PROTECTION: '1; mode=block',
  REFERRER_POLICY: 'strict-origin-when-cross-origin',
  CONTENT_SECURITY_POLICY: "default-src 'self'",
  STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains'
} as const

// =============================================================================
// VALIDATION PATTERNS
// =============================================================================

// Regular expressions for validation
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  PHONE: /^[+]?[1-9][\d]{0,15}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NO_SPECIAL_CHARS: /^[a-zA-Z0-9\s]+$/
} as const
