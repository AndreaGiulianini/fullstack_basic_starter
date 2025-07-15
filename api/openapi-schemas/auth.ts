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

// Profile response schema for docs (without transforms)
export const profileResponseSchemaForDocs = z.object({
  success: z.literal(true),
  user: z.object({
    id: textIdSchemaForDocs,
    email: emailSchemaForDocs,
    name: z.string().nullable()
  })
})

// =============================================================================
// AUTH REQUEST BODY SCHEMAS
// =============================================================================

// Forgot password request body schema
export const forgotPasswordBodySchema = z.object({
  email: emailSchema
})

// Forgot password request body schema for docs (without transforms)
export const forgotPasswordBodySchemaForDocs = z.object({
  email: emailSchemaForDocs
})

// Reset password request body schema
export const resetPasswordBodySchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Change password request body schema
export const changePasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Register request body schema
export const registerBodySchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long').trim(),
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Register request body schema for docs (without transforms)
export const registerBodySchemaForDocs = z
  .object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    email: emailSchemaForDocs,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Token verification request body schema
export const verifyTokenBodySchema = z.object({
  token: z.string().min(1, 'Token is required')
})

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Export types derived from schemas
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>
export type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>
export type RegisterBody = z.infer<typeof registerBodySchema>
export type VerifyTokenBody = z.infer<typeof verifyTokenBodySchema>

// =============================================================================
// LEGACY EXPORTS (for backward compatibility)
// =============================================================================

// @deprecated Use forgotPasswordBodySchema instead
export const forgotPasswordSchema = forgotPasswordBodySchema

// @deprecated Use resetPasswordBodySchema instead
export const resetPasswordSchema = resetPasswordBodySchema

// @deprecated Use changePasswordBodySchema instead
export const changePasswordSchema = changePasswordBodySchema

// @deprecated Use registerBodySchema instead
export const registerSchema = registerBodySchema

// @deprecated Use verifyTokenBodySchema instead
export const verifyTokenSchema = verifyTokenBodySchema

// @deprecated Use ForgotPasswordBody type instead
export type ForgotPassword = ForgotPasswordBody

// @deprecated Use ResetPasswordBody type instead
export type ResetPassword = ResetPasswordBody

// @deprecated Use ChangePasswordBody type instead
export type ChangePassword = ChangePasswordBody

// @deprecated Use RegisterBody type instead
export type Register = RegisterBody
