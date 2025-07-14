import type { ValidationDetails } from './validation'

// Common response types
export interface SuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
    details?: ValidationDetails
    timestamp: string
    path: string
  }
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse

// Database types
export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Query types
export interface QueryFilters {
  [key: string]: string | number | boolean | undefined
}

// File upload types
export interface FileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  destination?: string
}

export interface UploadedFile {
  filename: string
  originalName: string
  mimetype: string
  size: number
  path: string
}