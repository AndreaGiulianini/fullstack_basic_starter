import { eq } from 'drizzle-orm'
import type { CreateUserData, UpdateUserData, User } from '../schemas'
import { createUserBodySchema, emailSchema, user } from '../schemas'
import { AppError, ConflictError, NotFoundError } from '../utils/appError'
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants'
import db, { auth } from '../utils/db'
import { validateData } from '../utils/validation'

// =============================================================================
// USER SERVICE - DIRECT DRIZZLE ACCESS
// Simplified service layer with direct database access
// No more repository abstraction - cleaner and more performant
// =============================================================================

/**
 * Create a new user via Better-Auth
 */
export async function createUser(data: CreateUserData): Promise<User> {
  try {
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
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error creating user:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
  try {
    if (!id?.trim()) {
      throw new AppError('Invalid user ID', HTTP_STATUS.BAD_REQUEST)
    }

    const [foundUser] = await db.select().from(user).where(eq(user.id, id)).limit(1)

    return foundUser
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error finding user by ID:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  try {
    // Validate email format
    const validatedEmail = validateData(emailSchema, email)

    const [foundUser] = await db.select().from(user).where(eq(user.email, validatedEmail)).limit(1)

    return foundUser
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error finding user by email:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Update user data (excluding password - use Better-Auth for that)
 */
export async function updateUser(id: string, data: Partial<UpdateUserData>): Promise<User> {
  try {
    if (!id?.trim()) {
      throw new AppError('Invalid user ID', HTTP_STATUS.BAD_REQUEST)
    }

    // Check if user exists
    const existingUser = await findUserById(id)
    if (!existingUser) {
      throw new NotFoundError('User not found')
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
        throw new ConflictError('Email already in use')
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
      throw new AppError('Failed to update user', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    return updatedUser
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error updating user:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    if (!id?.trim()) {
      throw new AppError('Invalid user ID', HTTP_STATUS.BAD_REQUEST)
    }

    // Check if user exists
    const existingUser = await findUserById(id)
    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    // Delete via database (Better-Auth handles cascade)
    const result = await db.delete(user).where(eq(user.id, id))

    return result.rowCount !== null && result.rowCount > 0
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error deleting user:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Get all users (with pagination)
 */
export async function findAllUsers(options: { limit?: number; offset?: number } = {}): Promise<User[]> {
  try {
    const { limit = 10, offset = 0 } = options

    const users = await db.select().from(user).limit(limit).offset(offset)

    return users
  } catch (error) {
    console.error('Error finding all users:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Check if user exists by ID
 */
export async function userExists(id: string): Promise<boolean> {
  try {
    const foundUser = await findUserById(id)
    return !!foundUser
  } catch (_error) {
    return false
  }
}
