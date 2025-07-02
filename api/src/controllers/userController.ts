import { NotFoundError } from '../errors/appError'
import { createUser, getUser } from '../models/user'
import type { SafeUserApi, User } from '../types/database'
import db from '../utils/db'
import { sanitizeInput } from '../utils/validation'

export const getUserHandler = async (userId: string): Promise<SafeUserApi> => {
  // Validate UUID
  const validatedUserId = sanitizeInput.uuid(userId)

  const user: User | undefined = await getUser(db, validatedUserId)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Return safe user data without password, with API-ready date format
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString()
  }
}

export const createUserHandler = async (name: string, email: string, password: string): Promise<SafeUserApi> => {
  // Input validation is handled in the createUser model function
  const user: User = await createUser(db, name, email, password)

  // Return safe user data without password, with API-ready date format
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString()
  }
}
