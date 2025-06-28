import { z } from 'zod'

// Common field schemas
export const emailSchema = z.email('Invalid email format').toLowerCase()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
  )

export const nameSchema = z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters').trim()

export const uuidSchema = z.uuid('Invalid UUID format')

export const timestampSchema = z.coerce.date()

// URL and slug schemas
export const urlSchema = z.url('Invalid URL format')
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')

// Numeric schemas
export const positiveIntSchema = z.number().int().positive('Must be a positive integer')
export const nonNegativeIntSchema = z.number().int().min(0, 'Must be non-negative')

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Date range schemas
export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
    'Start date must be before or equal to end date'
  )

// File upload schemas
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimetype: z.string().regex(/^[a-z]+\/[a-z0-9\-+]+$/, 'Invalid MIME type'),
  size: positiveIntSchema.max(10 * 1024 * 1024, 'File size cannot exceed 10MB') // 10MB limit
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(255, 'Search query too long').trim().optional(),
  filters: z.record(z.string(), z.string()).optional()
})

// Response metadata schema
export const metadataSchema = z.object({
  timestamp: timestampSchema,
  version: z.string().optional(),
  requestId: uuidSchema.optional()
})
