import * as z from 'zod'

// =============================================================================
// ADVANCED ZOD UTILITIES
// =============================================================================

/**
 * Creates conditional validation based on another field
 * Example: password confirmation that depends on password field
 */
export const createConditionalSchema = <T extends Record<string, unknown>>(
  baseSchema: z.ZodType<T>,
  condition: (data: T) => boolean,
  conditionalSchema: z.ZodType<T>
): z.ZodType<T> => {
  return z.union([baseSchema.refine((data) => !condition(data), { message: 'Condition not met' }), conditionalSchema])
}

/**
 * Creates a schema that validates different formats for the same logical field
 * Useful for APIs that accept multiple input formats
 */
export const createFlexibleSchema = <T>(...schemas: z.ZodType<T>[]) => {
  return z.union(schemas as [z.ZodType<T>, z.ZodType<T>, ...z.ZodType<T>[]])
}

/**
 * Enhanced password confirmation pattern
 */
export const createPasswordConfirmationSchema = (passwordField = 'password', confirmField = 'confirmPassword') => {
  return z
    .object({
      [passwordField]: z.string().min(8, 'Password must be at least 8 characters'),
      [confirmField]: z.string()
    })
    .refine((data) => data[passwordField as keyof typeof data] === data[confirmField as keyof typeof data], {
      message: 'Passwords do not match',
      path: [confirmField]
    })
}

/**
 * Creates a schema with smart error messages based on field context
 */
export const createContextualSchema = <T>(schema: z.ZodType<T>, context: string) => {
  return schema.refine((data) => {
    const result = schema.safeParse(data)
    if (!result.success) {
      // Create new error with enhanced messages
      const enhancedIssues = result.error.issues.map((issue) => ({
        ...issue,
        message: `${context}: ${issue.message}`
      }))
      throw new z.ZodError(enhancedIssues)
    }
    return true
  })
}

/**
 * Creates pagination schema with smart defaults
 */
export const createPaginationSchema = (defaultLimit = 10, maxLimit = 100, defaultSort?: string) => {
  return z.object({
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(maxLimit, `Limit cannot exceed ${maxLimit}`)
      .default(defaultLimit),
    sortBy: z.string().optional().default(defaultSort),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().trim().optional()
  })
}

/**
 * Creates a schema that strips unknown fields but preserves known ones
 */
export const createStrippedSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape).strip()
}

/**
 * Creates a partial update schema that requires at least one field
 */
export const createPartialUpdateSchema = <T extends z.ZodRawShape>(shape: T) => {
  const partialSchema = z.object(shape).partial()
  return partialSchema.refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided for update'
  })
}

/**
 * Enhanced enum schema with fallback values
 */
export const createEnumWithFallback = <T extends string>(
  values: readonly [T, ...T[]],
  fallback: T,
  caseSensitive = false
) => {
  const enumSchema = z.enum(values)

  if (caseSensitive) {
    return enumSchema.catch(fallback)
  }

  return z
    .string()
    .transform((str) => str.toLowerCase())
    .pipe(enumSchema)
    .catch(fallback)
}

/**
 * Creates a date schema with range validation
 */
export const createDateRangeSchema = (minDate?: Date, maxDate?: Date, format?: 'iso' | 'timestamp' | 'object') => {
  let baseSchema: z.ZodType<Date>

  switch (format) {
    case 'timestamp':
      baseSchema = z.number().transform((ts) => new Date(ts))
      break
    case 'iso':
      baseSchema = z.string().pipe(z.coerce.date())
      break
    default:
      baseSchema = z.date()
  }

  if (minDate) {
    baseSchema = baseSchema.refine((date) => date >= minDate, {
      message: `Date must be after ${minDate.toISOString()}`
    })
  }

  if (maxDate) {
    baseSchema = baseSchema.refine((date) => date <= maxDate, {
      message: `Date must be before ${maxDate.toISOString()}`
    })
  }

  return baseSchema
}

// =============================================================================
// COMPOSITION UTILITIES
// =============================================================================

/**
 * Merges multiple schemas with conflict resolution
 */
export const mergeSchemas = <T, U>(schema1: z.ZodType<T>, schema2: z.ZodType<U>): z.ZodType<T & U> => {
  return schema1.and(schema2) as z.ZodType<T & U>
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Safe parsing with enhanced error information
 */
export const safeParse = <T>(schema: z.ZodType<T>, data: unknown) => {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true as const, data: result.data, errors: null }
  }

  return {
    success: false as const,
    data: null,
    errors: result.error.issues.map((issue) => ({
      path: issue.path.join('.') || 'root',
      message: issue.message,
      code: issue.code
    }))
  }
}

/**
 * Validates and transforms data with detailed error reporting
 */
export const validateAndTransform = <T, U>(
  schema: z.ZodType<T>,
  data: unknown,
  transformer?: (validData: T) => U
): { success: true; data: U } | { success: false; errors: Array<{ path: string; message: string; code: string }> } => {
  const parseResult = safeParse(schema, data)

  if (!parseResult.success) {
    return { success: false, errors: parseResult.errors }
  }

  const finalData = transformer ? transformer(parseResult.data) : (parseResult.data as unknown as U)

  return { success: true, data: finalData }
}
