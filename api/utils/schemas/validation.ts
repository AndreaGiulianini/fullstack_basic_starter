import * as z from 'zod'

// =============================================================================
// ZOD VALIDATION SCHEMAS
// All validation schemas centralized here
// Single source of truth for data validation and OpenAPI documentation
// =============================================================================

// =============================================================================
// BASIC FIELD SCHEMAS
// Reusable field-level validation schemas
// =============================================================================

/**
 * Email validation with transformation
 */
export const emailSchema = z.string().trim().email('Invalid email format').describe('User email address')

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .trim()
  .describe('User full name')

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password too long')
  .describe('User password')

/**
 * Text ID validation (for URLs and references)
 */
export const textIdSchema = z.string().min(1, 'ID is required').describe('Unique identifier')

// =============================================================================
// USER VALIDATION SCHEMAS
// =============================================================================

/**
 * Schema for creating a new user
 */
export const createUserBodySchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema
  })
  .describe('User creation data')

/**
 * Schema for user route parameters (ID)
 */
export const userParamsSchema = z
  .object({
    id: textIdSchema
  })
  .describe('User route parameters')

/**
 * Schema for safe user data (without password)
 */
export const safeUserSchema = z
  .object({
    id: textIdSchema,
    name: nameSchema.nullable(),
    email: emailSchema,
    image: z.url().nullable().describe('User profile image URL'),
    createdAt: z.string().datetime().describe('Account creation timestamp')
  })
  .describe('Safe user data without sensitive information')

/**
 * Schema for user update data
 */
export const updateUserBodySchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    image: z.url().optional().describe('User profile image URL')
  })
  .describe('User update data')

// =============================================================================
// NOTE: Session management is handled by Better-Auth JWT
// No custom session schemas needed - removed for simplicity
// =============================================================================

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

/**
 * Factory function for success response schemas
 */
export const createSuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z
    .object({
      success: z.literal(true),
      data: dataSchema,
      message: z.string().optional().describe('Optional success message')
    })
    .describe('Successful API response')

/**
 * User creation response schema
 */
export const createUserResponseSchema = createSuccessResponseSchema(safeUserSchema).describe(
  'User creation success response'
)

/**
 * Get user response schema
 */
export const getUserResponseSchema = createSuccessResponseSchema(safeUserSchema).describe('Get user success response')

/**
 * Error response schema
 */
export const errorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      message: z.string().describe('Error message'),
      code: z.string().describe('Error code'),
      statusCode: z.number().describe('HTTP status code'),
      timestamp: z.string().datetime().describe('Error timestamp'),
      path: z.string().describe('Request path'),
      details: z
        .array(
          z.object({
            field: z.string().describe('Field with error'),
            message: z.string().describe('Error message for field'),
            code: z.string().describe('Error code for field')
          })
        )
        .optional()
        .describe('Detailed validation errors')
    })
  })
  .describe('Error API response')

// =============================================================================
// TEST/UTILITY SCHEMAS
// =============================================================================

/**
 * Healthcheck response schema
 */
export const healthcheckResponseSchema = z
  .object({
    success: z.literal(true),
    message: z.string().describe('Health status message')
  })
  .describe('Health check response')

/**
 * Identity count request schema (for testing)
 */
export const identityCountBodySchema = z
  .object({
    amount: z.number().int().min(0).describe('Count amount')
  })
  .describe('Identity count request')

/**
 * Identity count response schema (for testing)
 */
export const identityCountResponseSchema = z
  .object({
    success: z.literal(true),
    amount: z.number().int().describe('Returned count amount')
  })
  .describe('Identity count response')

// =============================================================================
// BETTER-AUTH SCHEMAS
// =============================================================================

/**
 * Better-Auth sign up with email schema
 */
export const betterAuthSignUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    callbackURL: z.url().optional().describe('URL to redirect after verification')
  })
  .describe('Better-Auth email signup data')

/**
 * Better-Auth sign in with email schema
 */
export const betterAuthSignInSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    rememberMe: z.boolean().default(true).describe('Remember user session'),
    callbackURL: z.url().optional().describe('URL to redirect after sign in')
  })
  .describe('Better-Auth email signin data')

/**
 * Better-Auth social sign in schema
 */
export const betterAuthSocialSignInSchema = z
  .object({
    provider: z.enum(['google', 'github', 'discord', 'apple']).describe('Social provider'),
    callbackURL: z.url().optional().describe('URL to redirect after sign in'),
    errorCallbackURL: z.url().optional().describe('URL to redirect on error'),
    newUserCallbackURL: z.url().optional().describe('URL to redirect for new users')
  })
  .describe('Better-Auth social signin data')

/**
 * Better-Auth forgot password schema
 */
export const betterAuthForgotPasswordSchema = z
  .object({
    email: emailSchema,
    redirectTo: z.url().optional().describe('URL to redirect after reset')
  })
  .describe('Better-Auth forgot password data')

/**
 * Better-Auth reset password schema
 */
export const betterAuthResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required').describe('Password reset token'),
    password: passwordSchema
  })
  .describe('Better-Auth reset password data')

/**
 * Better-Auth session response schema
 */
export const betterAuthSessionResponseSchema = z
  .object({
    user: safeUserSchema.nullable(),
    session: z
      .object({
        id: textIdSchema,
        userId: textIdSchema,
        expiresAt: z.string().datetime().describe('Session expiration'),
        token: z.string().describe('Session token'),
        ipAddress: z.string().optional().describe('Client IP'),
        userAgent: z.string().optional().describe('Client user agent')
      })
      .nullable()
  })
  .describe('Better-Auth session data')

/**
 * Better-Auth success response schema (for operations like signout)
 */
export const betterAuthSuccessResponseSchema = z
  .object({
    success: z.literal(true),
    message: z.string().optional().describe('Operation success message')
  })
  .describe('Better-Auth operation success response')

// =============================================================================
// PAGINATION SCHEMAS
// =============================================================================

/**
 * Pagination query parameters schema
 */
export const paginationQuerySchema = z
  .object({
    page: z.number().int().min(1).default(1).describe('Page number'),
    limit: z.number().int().min(1).max(100).default(10).describe('Items per page'),
    sortBy: z.string().optional().describe('Sort field'),
    sortOrder: z.enum(['asc', 'desc']).default('desc').describe('Sort order'),
    search: z.string().optional().describe('Search term')
  })
  .describe('Pagination query parameters')

/**
 * Paginated response schema factory
 */
export const createPaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z
    .object({
      success: z.literal(true),
      data: z.object({
        items: z.array(itemSchema).describe('Page items'),
        pagination: z.object({
          page: z.number().int().describe('Current page'),
          limit: z.number().int().describe('Items per page'),
          total: z.number().int().describe('Total items'),
          totalPages: z.number().int().describe('Total pages'),
          hasNext: z.boolean().describe('Has next page'),
          hasPrev: z.boolean().describe('Has previous page')
        })
      })
    })
    .describe('Paginated API response')

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Export all schemas for easy access
 */
export const validationSchemas = {
  // Field schemas
  emailSchema,
  nameSchema,
  passwordSchema,
  textIdSchema,

  // User schemas
  createUserBodySchema,
  userParamsSchema,
  safeUserSchema,
  updateUserBodySchema,

  // Note: Custom session schemas removed - using Better-Auth JWT only

  // Response schemas
  createUserResponseSchema,
  getUserResponseSchema,
  errorResponseSchema,

  // Test schemas
  healthcheckResponseSchema,
  identityCountBodySchema,
  identityCountResponseSchema,

  // Pagination schemas
  paginationQuerySchema,

  // Better-Auth schemas
  betterAuthSignUpSchema,
  betterAuthSignInSchema,
  betterAuthSocialSignInSchema,
  betterAuthForgotPasswordSchema,
  betterAuthResetPasswordSchema,
  betterAuthSessionResponseSchema,
  betterAuthSuccessResponseSchema
} as const

/**
 * Type definitions for schemas
 */
export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type UserParams = z.infer<typeof userParamsSchema>
export type SafeUserFromSchema = z.infer<typeof safeUserSchema>
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>
// Note: Custom session types removed - using Better-Auth JWT only
export type PaginationQuery = z.infer<typeof paginationQuerySchema>
export type BetterAuthSignUp = z.infer<typeof betterAuthSignUpSchema>
export type BetterAuthSignIn = z.infer<typeof betterAuthSignInSchema>
export type BetterAuthSocialSignIn = z.infer<typeof betterAuthSocialSignInSchema>
export type BetterAuthForgotPassword = z.infer<typeof betterAuthForgotPasswordSchema>
export type BetterAuthResetPassword = z.infer<typeof betterAuthResetPasswordSchema>
