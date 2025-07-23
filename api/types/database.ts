import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

// Database instance type
export type DatabaseInstance = NodePgDatabase

// User model types (matching the better-auth schema)
export interface User {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SafeUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
}

export interface SafeUserApi {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: string // ISO string for API responses
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
}

// Query result types
export interface UserQueryResult {
  user: User | null
  found: boolean
}

export interface UsersQueryResult {
  users: User[]
  total: number
}
