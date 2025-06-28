import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

// Database instance type
export type DatabaseInstance = NodePgDatabase

// User model types (matching the actual Drizzle schema)
export interface User {
  id: string
  email: string
  name: string | null
  password: string
  createdAt: Date
}

export interface SafeUser {
  id: string
  email: string
  name: string | null
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

// Database operation types
export type CreateUserFunction = (db: DatabaseInstance, name: string, email: string, password: string) => Promise<User>

export type GetUserFunction = (db: DatabaseInstance, id: string) => Promise<User | null>

export type UpdateUserFunction = (db: DatabaseInstance, id: string, data: UpdateUserData) => Promise<User>

export type DeleteUserFunction = (db: DatabaseInstance, id: string) => Promise<void>

// Query result types
export interface UserQueryResult {
  user: User | null
  found: boolean
}

export interface UsersQueryResult {
  users: User[]
  total: number
}
