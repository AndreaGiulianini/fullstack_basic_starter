import * as z from 'zod'
import { emailSchema, textIdSchema, emailSchemaForDocs, textIdSchemaForDocs } from './common'

// Profile schemas
export const profileResponseSchema = z.object({
  success: z.literal(true),
  user: z.object({
    id: textIdSchema,
    email: emailSchema,
    name: z.string().nullable()
  })
})

// Profile response schema without transforms for JSON Schema generation
export const profileResponseSchemaForDocs = z.object({
  success: z.literal(true),
  user: z.object({
    id: textIdSchemaForDocs,
    email: emailSchemaForDocs,
    name: z.string().nullable()
  })
})

// Password reset schemas
export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Register schema
export const registerSchema = z
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

// Token verification schema
export const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

// Export types derived from schemas
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>
export type ResetPassword = z.infer<typeof resetPasswordSchema>
export type ChangePassword = z.infer<typeof changePasswordSchema>
export type Register = z.infer<typeof registerSchema>
