// =============================================================================
// SCHEMAS INDEX - UNIFIED SCHEMA SYSTEM
// Single point of access for all schemas, types, and validation
// Clean separation of concerns with logical organization
// =============================================================================

// Database schemas (Drizzle)
export * from './database'
// Re-export for convenience
export { default as databaseSchemas } from './database'

// TypeScript types
export * from './types'
// Validation schemas (Zod)
export * from './validation'

// =============================================================================
// QUICK ACCESS COLLECTIONS
// =============================================================================

/**
 * All schemas in one place for easy access
 */
export { validationSchemas } from './validation'

/**
 * All database tables exported above via * from './database'
 */
