import { NotFoundError } from '../errors/appError'
import { createUser, getUser } from '../models/user'
import type { SafeUser, User } from '../types/database'
import db from '../utils/db'
import { dbHandler } from '../utils/errorHelpers'
import { sanitizeInput } from '../utils/validation'

export const getUserHandler = dbHandler(async (userId: string): Promise<SafeUser> => {
  // Validate UUID
  const validatedUserId = sanitizeInput.uuid(userId, 'userId')

  const user: User | undefined = await getUser(db, validatedUserId)
  if (!user) {
    throw new NotFoundError('User', 'User not found')
  }

  // Return safe user data without password
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
})

export const createUserHandler = dbHandler(async (name: string, email: string, password: string): Promise<SafeUser> => {
  // Input validation is handled in the createUser model function
  const user: User = await createUser(db, name, email, password)

  // Return safe user data without password
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
})
