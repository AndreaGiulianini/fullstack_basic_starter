import type { InferSelectModel } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { account, session, user, verification } from './schema'

// =============================================================================
// TYPE DEFINITIONS
// All TypeScript types inferred from database schemas
// =============================================================================

export type User = InferSelectModel<typeof user>
export type Session = InferSelectModel<typeof session>
export type Account = InferSelectModel<typeof account>
export type Verification = InferSelectModel<typeof verification>

// =============================================================================
// DATABASE TYPES
// Proper typing for database instances
// =============================================================================

export type DatabaseSchema = {
  user: typeof user
  session: typeof session
  account: typeof account
  verification: typeof verification
}

export type DatabaseInstance = NodePgDatabase<DatabaseSchema>

// =============================================================================
// API RESPONSE TYPES
// Types for API responses (safe versions without sensitive data)
// =============================================================================

export type SafeUser = Omit<User, 'emailVerified'>
export type SafeUserApi = SafeUser & {
  createdAt: string // ISO string format for API
}

// =============================================================================
// REPOSITORY INTERFACES
// Interfaces for repository patterns (useful for testing and DI)
// =============================================================================

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  update(id: string, data: Partial<UpdateUserData>): Promise<User>
  delete(id: string): Promise<boolean>
}

export interface ISessionRepository {
  findByToken(token: string): Promise<Session | undefined>
  findByUserId(userId: string): Promise<Session[]>
  create(data: CreateSessionData): Promise<Session>
  delete(id: string): Promise<boolean>
}

// =============================================================================
// DATA TRANSFER OBJECTS
// Input/output types for repository methods
// =============================================================================

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  image?: string
}

export interface CreateSessionData {
  token: string
  userId: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
}
