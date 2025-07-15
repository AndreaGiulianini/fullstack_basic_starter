import * as z from 'zod'
import { emailSchema, emailSchemaForDocs, textIdSchema, textIdSchemaForDocs } from './common'

// =============================================================================
// AUTH RESPONSE SCHEMAS
// =============================================================================

// Profile response schema
export const profileResponseSchema = z.object({
  success: z.literal(true),
  user: z.object({
    id: textIdSchema,
    email: emailSchema,
    name: z.string().nullable()
  })
})

// For docs (without transforms)
export const profileResponseSchemaForDocs = z.object({
  success: z.literal(true),
  user: z.object({
    id: textIdSchemaForDocs,
    email: emailSchemaForDocs,
    name: z.string().nullable()
  })
})

// =============================================================================
// AUTH REQUEST SCHEMAS - IMPROVED
// =============================================================================

// Forgot password request schema
export const forgotPasswordBodySchema = z.object({
  email: emailSchema
})

export const forgotPasswordBodySchemaForDocs = z.object({
  email: emailSchemaForDocs
})

// Reset password request schema - Using improved password confirmation
const resetPasswordBase = {
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}

export const resetPasswordBodySchema = z
  .object(resetPasswordBase)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const resetPasswordBodySchemaForDocs = resetPasswordBodySchema

// Change password request schema - Using improved validation
const changePasswordBase = {
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}

export const changePasswordBodySchema = z
  .object(changePasswordBase)
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const changePasswordBodySchemaForDocs = changePasswordBodySchema

// Register request body schema - Using improved utility
const registerBase = {
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}

export const registerBodySchema = z
  .object({
    ...registerBase,
    name: registerBase.name.transform((name) => name.trim())
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// For docs (without transforms)
export const registerBodySchemaForDocs = z
  .object(registerBase)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Verify token request schema
export const verifyTokenBodySchema = z.object({
  token: z.string().min(1, 'Token is required')
})

export const verifyTokenBodySchemaForDocs = verifyTokenBodySchema

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>
export type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>
export type RegisterBody = z.infer<typeof registerBodySchema>
export type VerifyTokenBody = z.infer<typeof verifyTokenBodySchema>

// =============================================================================
// LEGACY EXPORTS (DEPRECATED)
// =============================================================================

/** @deprecated Use registerBodySchema instead */
export const registerSchema = registerBodySchema
/** @deprecated Use forgotPasswordBodySchema instead */
export const forgotPasswordSchema = forgotPasswordBodySchema
/** @deprecated Use resetPasswordBodySchema instead */
export const resetPasswordSchema = resetPasswordBodySchema
/** @deprecated Use changePasswordBodySchema instead */
export const changePasswordSchema = changePasswordBodySchema
/** @deprecated Use verifyTokenBodySchema instead */
export const verifyTokenSchema = verifyTokenBodySchema
