import * as z from 'zod'
import { emailSchema, passwordSchema, uuidSchema } from './common'

// JWT Payload schema
export const jwtPayloadSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  iat: z.number().optional(), // Issued at
  exp: z.number().optional() // Expires at
})

// Login schemas
export const loginBodySchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const loginResponseSchema = z.object({
  success: z.literal(true),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required')
})

// Refresh token schemas
export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

export const refreshTokenResponseSchema = loginResponseSchema

// Profile schemas
export const profileResponseSchema = z.object({
  success: z.literal(true),
  user: z.object({
    id: uuidSchema,
    email: emailSchema,
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
    password: passwordSchema,
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
    newPassword: passwordSchema,
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
    password: passwordSchema,
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
export type JWTPayload = z.infer<typeof jwtPayloadSchema>
export type LoginBody = z.infer<typeof loginBodySchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>
export type ResetPassword = z.infer<typeof resetPasswordSchema>
export type ChangePassword = z.infer<typeof changePasswordSchema>
export type Register = z.infer<typeof registerSchema>
