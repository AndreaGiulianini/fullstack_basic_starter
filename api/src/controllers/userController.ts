import { NotFoundError } from '../errors/appError'
import { createUser, getUser } from '../models/user'
import type { SafeUser, User } from '../types/database'
import db from '../utils/db'
import { asyncHandler } from '../utils/errorHelpers'
import { sanitizeInput } from '../utils/validation'

export const getUserHandler = asyncHandler(async (userId: string): Promise<SafeUser> => {
  // Validate UUID
  const validatedUserId = sanitizeInput.uuid(userId)

  const user: User | undefined = await getUser(db, validatedUserId)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Return safe user data without password
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
})

export const createUserHandler = asyncHandler(
  async (name: string, email: string, password: string): Promise<SafeUser> => {
    // Input validation is handled in the createUser model function
    const user: User = await createUser(db, name, email, password)

    // Return safe user data without password
    return {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }
)
