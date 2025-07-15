import type { InferSelectModel } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants'
import { user } from '../database-models/betterAuthModels'
import { AppError, ConflictError } from '../errors/appError'
import type db from '../utils/db'
import { auth } from '../utils/db'
import { sanitizeInput } from '../utils/validation'

// Export the better-auth user table
export const users = user

export type User = InferSelectModel<typeof user>

export async function createUser(dbInstance: typeof db, name: string, email: string, password: string): Promise<User> {
  // Validate and sanitize input using Zod schemas
  const validatedEmail = sanitizeInput.email(email)
  const validatedName = sanitizeInput.name(name)
  const validatedPassword = sanitizeInput.password(password)

  // Check if the user already exists
  const existingUser = await dbInstance.select().from(user).where(eq(user.email, validatedEmail)).limit(1)
  if (existingUser.length > 0) {
    throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS)
  }

  // Use better-auth's sign-up API to create the user
  const result = await auth.api.signUpEmail({
    body: {
      name: validatedName,
      email: validatedEmail,
      password: validatedPassword
    }
  })

  if (!result.user) {
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }

  // Convert the better-auth user to our User type
  const userRecord: User = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    emailVerified: result.user.emailVerified,
    image: result.user.image || null,
    createdAt: result.user.createdAt,
    updatedAt: result.user.updatedAt
  }

  return userRecord
}

export async function getUser(dbInstance: typeof db, id: string): Promise<User | undefined> {
  // Validate the ID (better-auth uses text IDs, not UUIDs)
  const validatedId = id.trim()
  if (!validatedId) {
    throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
  }

  const [userRecord] = await dbInstance.select().from(user).where(eq(user.id, validatedId)).limit(1)
  return userRecord
}
