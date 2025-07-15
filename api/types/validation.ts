import type { core } from 'zod'

// Validation error details types
export interface ValidationErrorDetail {
  field: string
  message: string
  code: string
}

export interface ZodValidationDetails {
  issues: core.$ZodIssue[]
}

export interface SchemaValidationDetails {
  field: string
  message: string
  code: string
  path: (string | number)[]
}

// Generic validation details union
export type ValidationDetails = ValidationErrorDetail[] | ZodValidationDetails | SchemaValidationDetails[] | string

// Fastify error interface
export interface FastifyError extends Error {
  statusCode?: number
  code?: string
  validation?: ValidationErrorDetail[]
}
