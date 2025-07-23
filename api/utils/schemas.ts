import * as z from 'zod'

// =============================================================================
// CONSOLIDATED SCHEMAS
// Essential schemas for API validation and documentation
// =============================================================================

// =============================================================================
// BASIC FIELD SCHEMAS
// =============================================================================

export const emailSchema = z
  .email('Invalid email format')
  .toLowerCase()
  .transform((email) => email.trim())
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(255, 'Name must not exceed 255 characters')
  .transform((name) => name.trim())
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
  )

export const textIdSchema = z.string().min(1, 'ID is required')
export const timestampSchema = z.date()

// =============================================================================
// USER SCHEMAS
// =============================================================================

// Safe user schema for API responses
export const safeUserApiSchema = z.object({
  id: textIdSchema,
  name: nameSchema.nullable(),
  email: emailSchema,
  image: z.string().url().nullable(),
  createdAt: z.string().datetime()
})

// Create user request
export const createUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
})

// User params (for route parameters)
export const userParamsSchema = z.object({
  id: textIdSchema
})

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

// Standard success response
export const successResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional()
  })

// Error response
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string(),
    statusCode: z.number(),
    details: z.unknown().optional(),
    timestamp: z.string(),
    path: z.string(),
    requestId: z.string().optional()
  })
})

// =============================================================================
// SCHEMAS FOR DOCS (OpenAPI compatible)
// =============================================================================

export const emailSchemaForDocs = z.string().email('Invalid email format').describe('User email address')
export const nameSchemaForDocs = z.string().min(1).max(255).describe('User full name')
export const textIdSchemaForDocs = z.string().min(1).describe('User ID')

export const userParamsSchemaForDocs = z.object({
  id: textIdSchemaForDocs
})

export const createUserBodySchemaForDocs = z.object({
  name: nameSchemaForDocs,
  email: emailSchemaForDocs,
  password: z.string().min(8).max(100).describe('User password')
})

export const getUserResponseSchemaForDocs = z.object({
  success: z.literal(true),
  data: z.object({
    id: textIdSchemaForDocs,
    name: nameSchemaForDocs.nullable(),
    email: emailSchemaForDocs,
    image: z.url().nullable().describe('User profile image URL'),
    createdAt: z.string().datetime().describe('Account creation timestamp')
  })
})

export const createUserResponseSchemaForDocs = z.object({
  success: z.literal(true),
  data: z.object({
    id: textIdSchemaForDocs,
    name: nameSchemaForDocs.nullable(),
    email: emailSchemaForDocs,
    image: z.url().nullable(),
    createdAt: z.string().datetime()
  }),
  message: z.string()
})

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type UserParams = z.infer<typeof userParamsSchema>
export type SafeUserApi = z.infer<typeof safeUserApiSchema>
