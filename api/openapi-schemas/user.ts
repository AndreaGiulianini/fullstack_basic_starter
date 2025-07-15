import * as z from 'zod'
import {
  emailSchema,
  emailSchemaForDocs,
  idParamsSchema,
  idParamsSchemaForDocs,
  nameSchema,
  nameSchemaForDocs,
  paginatedResponseSchema,
  paginationSchema,
  passwordSchema,
  successResponseSchema,
  textIdSchema,
  textIdSchemaForDocs,
  timestampSchema
} from './common'

// =============================================================================
// BASE USER SCHEMAS
// =============================================================================

// Core user schema (matches database structure)
export const userSchema = z.object({
  id: textIdSchema,
  name: nameSchema.nullable(),
  email: emailSchema,
  emailVerified: z.boolean().default(false),
  image: z.url().nullable(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema
})

// Safe user schema for API responses (excludes sensitive data)
export const safeUserSchema = userSchema.omit({
  emailVerified: true,
  updatedAt: true
})

// API-compatible user schema with string dates
export const safeUserApiSchema = z.object({
  id: textIdSchema,
  name: nameSchema.nullable(),
  email: emailSchema,
  image: z.url().nullable(),
  createdAt: z.iso.datetime()
})

// API-compatible user schema for docs (without transforms)
export const safeUserApiSchemaForDocs = z.object({
  id: textIdSchemaForDocs,
  name: nameSchemaForDocs.nullable(),
  email: emailSchemaForDocs,
  image: z.url().nullable(),
  createdAt: z.iso.datetime()
})

// =============================================================================
// USER OPERATION SCHEMAS
// =============================================================================

// Create user request
export const createUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
})

// Create user request schema for docs (without transforms)
export const createUserBodySchemaForDocs = z.object({
  name: nameSchemaForDocs,
  email: emailSchemaForDocs,
  password: passwordSchema
})

// Update user request
export const updateUserBodySchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    image: z.url().nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field must be provided for update')

// Update user request schema for docs (without transforms)
export const updateUserBodySchemaForDocs = z
  .object({
    name: nameSchemaForDocs.optional(),
    email: emailSchemaForDocs.optional(),
    image: z.url().nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field must be provided for update')

// User query parameters
export const userParamsSchema = idParamsSchema

// User params schema for docs (without transforms)
export const userParamsSchemaForDocs = idParamsSchemaForDocs

// User list query parameters
export const userListQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  role: z.enum(['admin', 'user']).optional(),
  status: z.enum(['active', 'inactive', 'banned']).optional()
})

// =============================================================================
// USER PREFERENCES AND PROFILE SCHEMAS
// =============================================================================

// User preferences
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.enum(['en', 'it', 'es', 'fr', 'de']).default('en'),
  timezone: z.string().default('UTC'),
  notifications: z
    .object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      sms: z.boolean().default(false)
    })
    .default({
      email: true,
      push: true,
      sms: false
    })
})

// Extended user profile
export const userProfileSchema = userSchema.extend({
  preferences: userPreferencesSchema.optional(),
  lastLoginAt: timestampSchema.nullable().optional(),
  role: z.enum(['admin', 'user']).default('user'),
  status: z.enum(['active', 'inactive', 'banned']).default('active')
})

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

// User creation response
export const createUserResponseSchema = successResponseSchema(safeUserApiSchema)

// User creation response schema for docs (without transforms)
export const createUserResponseSchemaForDocs = successResponseSchema(safeUserApiSchemaForDocs)

// User retrieval response
export const getUserResponseSchema = successResponseSchema(safeUserApiSchema)

// User retrieval response schema for docs (without transforms)
export const getUserResponseSchemaForDocs = successResponseSchema(safeUserApiSchemaForDocs)

// User update response
export const updateUserResponseSchema = successResponseSchema(safeUserApiSchema)

// User update response schema for docs (without transforms)
export const updateUserResponseSchemaForDocs = successResponseSchema(safeUserApiSchemaForDocs)

// User list response
export const getUserListResponseSchema = paginatedResponseSchema(safeUserApiSchema)

// User list response schema for docs (without transforms)
export const getUserListResponseSchemaForDocs = paginatedResponseSchema(safeUserApiSchemaForDocs)

// User profile response (for authenticated user)
export const userProfileResponseSchema = successResponseSchema(
  userProfileSchema.omit({ emailVerified: true, updatedAt: true })
)

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Infer TypeScript types from schemas
export type User = z.infer<typeof userSchema>
export type SafeUser = z.infer<typeof safeUserSchema>
export type SafeUserApi = z.infer<typeof safeUserApiSchema>
export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>
export type UserParams = z.infer<typeof userParamsSchema>
export type UserListQuery = z.infer<typeof userListQuerySchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
