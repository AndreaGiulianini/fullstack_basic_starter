import * as z from 'zod'

// =============================================================================
// ESSENTIAL ZOD UTILITIES
// Only utilities actually used in the project
// =============================================================================

/**
 * Safe parsing with improved error information
 * (Used by validation.ts)
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

// =============================================================================
// COMMON SCHEMAS (for future use if needed)
// =============================================================================

/**
 * Base pagination schema (for future implementations)
 */
export const createPaginationSchema = (defaultLimit = 10, maxLimit = 100) => {
  return z.object({
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(maxLimit, `Limit cannot exceed ${maxLimit}`)
      .default(defaultLimit),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().trim().optional()
  })
}
