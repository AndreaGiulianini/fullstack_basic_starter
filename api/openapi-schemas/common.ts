import * as z from 'zod'

// =============================================================================
// BASIC FIELD SCHEMAS
// =============================================================================

// Email validation with proper formatting
export const emailSchema = z
  .email('Invalid email format')
  .toLowerCase()
  .transform((email) => email.trim())

// Email schema without transforms for JSON Schema generation
export const emailSchemaForDocs = z.email('Invalid email format').toLowerCase()

// Password validation with security requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
  )

// Name validation with sanitization
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(255, 'Name must not exceed 255 characters')
  .transform((name) => name.trim())

// Name schema without transforms for JSON Schema generation
export const nameSchemaForDocs = z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters')

// ID schemas for different use cases
export const uuidSchema = z.uuid('Invalid UUID format')
export const textIdSchema = z
  .string()
  .min(1, 'ID is required')
  .max(255, 'ID must not exceed 255 characters')
  .transform((id) => id.trim())

// Text ID schema without transforms for JSON Schema generation
export const textIdSchemaForDocs = z.string().min(1, 'ID is required').max(255, 'ID must not exceed 255 characters')

// =============================================================================
// UTILITY SCHEMAS
// =============================================================================

// URL and slug validation
export const urlSchema = z.url('Invalid URL format')
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')

// Numeric schemas with validation
export const positiveIntSchema = z.number().int().positive('Must be a positive integer')
export const nonNegativeIntSchema = z.number().int().min(0, 'Must be non-negative')

// Date and time schemas
export const timestampSchema = z.date()
export const dateStringSchema = z.iso.datetime('Invalid date format')
export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
    'Start date must be before or equal to end date'
  )

// =============================================================================
// PAGINATION AND SEARCH SCHEMAS
// =============================================================================

// Enhanced pagination with sorting
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Search functionality
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(255, 'Search query too long').trim().optional(),
  filters: z.record(z.string(), z.string()).optional(),
  ...paginationSchema.shape
})

// =============================================================================
// FILE UPLOAD SCHEMAS
// =============================================================================

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  originalName: z.string().min(1, 'Original filename is required'),
  mimetype: z.string().regex(/^[a-z]+\/[a-z0-9\-+]+$/, 'Invalid MIME type'),
  size: positiveIntSchema.max(10 * 1024 * 1024, 'File size cannot exceed 10MB'), // 10MB limit
  path: z.string().optional()
})

// Image-specific validation
export const imageUploadSchema = fileUploadSchema.extend({
  mimetype: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, 'Invalid image format'),
  width: positiveIntSchema.optional(),
  height: positiveIntSchema.optional()
})

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

// Standard API response schemas
export const successResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional()
  })

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

// Paginated response schema
export const paginatedResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  })

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

// Common validation patterns
export const validationPatterns = {
  phone: /^[+]?[1-9][\d]{0,15}$/,
  postalCode: /^\d{5}(-\d{4})?$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/
} as const

// Reusable validation schemas
export const phoneSchema = z.string().regex(validationPatterns.phone, 'Invalid phone number')
export const postalCodeSchema = z.string().regex(validationPatterns.postalCode, 'Invalid postal code')
export const alphanumericSchema = z
  .string()
  .regex(validationPatterns.alphanumeric, 'Only alphanumeric characters allowed')

// =============================================================================
// EXPORTS
// =============================================================================

// Export commonly used combinations
export const idParamsSchema = z.object({
  id: textIdSchema
})

// ID params schema for docs (without transforms)
export const idParamsSchemaForDocs = z.object({
  id: textIdSchemaForDocs
})

export const uuidParamsSchema = z.object({
  id: uuidSchema
})
