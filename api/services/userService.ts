import { eq } from 'drizzle-orm'
import { AppError, ConflictError, NotFoundError } from '../utils/appError'
import { DB_QUERY_LIMITS, ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants'
import db, { auth } from '../utils/db'
import type { CreateUserData, UpdateUserData, User } from '../utils/schemas'
import { createUserBodySchema, emailSchema, user } from '../utils/schemas'
import { validateData } from '../utils/validation'

// =============================================================================
// USER SERVICE - DIRECT DRIZZLE ACCESS
// Simplified service layer with direct database access
// No more repository abstraction - cleaner and more performant
// Error handling is done by middleware - services just throw errors
// =============================================================================

/**
 * Create a new user via Better-Auth
 */
export async function createUser(data: CreateUserData): Promise<User> {
  // Validate input data
  const validatedData = validateData(createUserBodySchema, data)

  // Check if user already exists
  const existingUser = await findUserByEmail(validatedData.email)
  if (existingUser) {
    throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS)
  }

  // Create user via Better-Auth API for secure password handling
  const result = await auth.api.signUpEmail({
    body: {
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password
    }
  })

  if (!result.user) {
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }

  // Return standardized User type
  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    emailVerified: result.user.emailVerified,
    image: result.user.image || null,
    createdAt: result.user.createdAt,
    updatedAt: result.user.updatedAt
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
  if (!id?.trim()) {
    throw new AppError(ERROR_MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST)
  }

  const [foundUser] = await db.select().from(user).where(eq(user.id, id)).limit(DB_QUERY_LIMITS.SINGLE_RECORD)
  return foundUser
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  // Validate email format
  const validatedEmail = validateData(emailSchema, email)

  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, validatedEmail))
    .limit(DB_QUERY_LIMITS.SINGLE_RECORD)
  return foundUser
}

/**
 * Update user data (excluding password - use Better-Auth for that)
 */
export async function updateUser(id: string, data: Partial<UpdateUserData>): Promise<User> {
  if (!id?.trim()) {
    throw new AppError(ERROR_MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST)
  }

  // Check if user exists
  const existingUser = await findUserById(id)
  if (!existingUser) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND)
  }

  // Prepare update data (exclude password - handle via Better-Auth)
  const updateData: Partial<UpdateUserData> = {}

  if (data.name !== undefined) {
    updateData.name = data.name
  }

  if (data.email !== undefined) {
    // Validate email if provided
    const validatedEmail = validateData(emailSchema, data.email)

    // Check email uniqueness
    const emailExists = await findUserByEmail(validatedEmail)
    if (emailExists && emailExists.id !== id) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE)
    }

    updateData.email = validatedEmail
  }

  // Update user directly in database
  const [updatedUser] = await db
    .update(user)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(user.id, id))
    .returning()

  if (!updatedUser) {
    throw new AppError(ERROR_MESSAGES.USER_UPDATE_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }

  return updatedUser
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<boolean> {
  if (!id?.trim()) {
    throw new AppError(ERROR_MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST)
  }

  // Check if user exists
  const existingUser = await findUserById(id)
  if (!existingUser) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND)
  }

  // Delete via database (Better-Auth handles cascade)
  const result = await db.delete(user).where(eq(user.id, id))

  return result.rowCount !== null && result.rowCount > 0
}

/**
 * Get all users (with pagination)
 */
export async function findAllUsers(options: { limit?: number; offset?: number } = {}): Promise<User[]> {
  const { limit = DB_QUERY_LIMITS.DEFAULT_PAGE_SIZE, offset = DB_QUERY_LIMITS.DEFAULT_OFFSET } = options

  const users = await db.select().from(user).limit(limit).offset(offset)
  return users
}

/**
 * Check if user exists by ID
 */
export async function userExists(id: string): Promise<boolean> {
  const foundUser = await findUserById(id)
  return !!foundUser
}
