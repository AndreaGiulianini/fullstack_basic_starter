import { z } from 'zod'
import { emailSchema, nameSchema, paginationSchema, passwordSchema, timestampSchema, uuidSchema } from './common'

// Base user schema (matches database)
export const userSchema = z.object({
  id: uuidSchema,
  name: nameSchema.nullable(),
  email: emailSchema,
  password: z.string(), // Don't validate password here as it's hashed
  createdAt: timestampSchema
})

// Safe user schema (without password)
export const safeUserSchema = userSchema.omit({ password: true })

// API documentation schemas (using string dates for JSON Schema compatibility)
export const safeUserApiSchema = z.object({
  id: uuidSchema,
  name: nameSchema.nullable(),
  email: emailSchema,
  createdAt: z.string().datetime()
})

// Create user schemas
export const createUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
})

export const createUserResponseSchema = z.object({
  success: z.literal(true),
  data: safeUserApiSchema,
  message: z.string().optional()
})

// Update user schemas
export const updateUserBodySchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional()
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field must be provided for update')

export const updateUserResponseSchema = z.object({
  success: z.literal(true),
  data: safeUserApiSchema,
  message: z.string().optional()
})

// Get user schemas
export const userParamsSchema = z.object({
  userId: uuidSchema
})

export const getUserResponseSchema = z.object({
  success: z.literal(true),
  data: safeUserApiSchema
})

// List users schemas
export const listUsersQuerySchema = paginationSchema.extend({
  search: z.string().min(1).max(255).trim().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt']).default('createdAt'),
  role: z.enum(['admin', 'user']).optional(),
  status: z.enum(['active', 'inactive', 'banned']).optional()
})

export const listUsersResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(safeUserApiSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  })
})

// Delete user schemas
export const deleteUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string()
})

// User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.enum(['en', 'it', 'es', 'fr', 'de']).default('en'),
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
    }),
  timezone: z.string().default('UTC')
})

// User profile schema (extended user info)
export const userProfileSchema = safeUserSchema.extend({
  preferences: userPreferencesSchema.optional(),
  lastLoginAt: timestampSchema.nullable().optional(),
  isEmailVerified: z.boolean().default(false),
  role: z.enum(['admin', 'user']).default('user'),
  status: z.enum(['active', 'inactive', 'banned']).default('active')
})

// User profile API schema (for documentation)
export const userProfileApiSchema = safeUserApiSchema.extend({
  preferences: userPreferencesSchema.optional(),
  lastLoginAt: z.string().datetime().nullable().optional(),
  isEmailVerified: z.boolean().default(false),
  role: z.enum(['admin', 'user']).default('user'),
  status: z.enum(['active', 'inactive', 'banned']).default('active')
})

// Bulk operations schemas
export const bulkDeleteUsersSchema = z.object({
  userIds: z
    .array(uuidSchema)
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot delete more than 100 users at once')
})

export const bulkUpdateUsersSchema = z.object({
  userIds: z
    .array(uuidSchema)
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot update more than 100 users at once'),
  updates: z
    .object({
      status: z.enum(['active', 'inactive', 'banned']).optional(),
      role: z.enum(['admin', 'user']).optional()
    })
    .refine((data) => Object.keys(data).length > 0, 'At least one update field must be provided')
})

// Export types derived from schemas
export type User = z.infer<typeof userSchema>
export type SafeUser = z.infer<typeof safeUserSchema>
export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>
export type UserParams = z.infer<typeof userParamsSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
export type BulkDeleteUsers = z.infer<typeof bulkDeleteUsersSchema>
export type BulkUpdateUsers = z.infer<typeof bulkUpdateUsersSchema>
