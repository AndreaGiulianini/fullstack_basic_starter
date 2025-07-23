import { eq } from 'drizzle-orm'
import { AppError, ConflictError } from '../../utils/appError'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../utils/constants'
import { auth } from '../../utils/db'
import { sanitizeInput } from '../../utils/validation'
import { user } from '../schema'
import type { CreateUserData, DatabaseInstance, IUserRepository, UpdateUserData, User } from '../types'

// =============================================================================
// USER REPOSITORY IMPLEMENTATION
// Handles all user-related database operations
// =============================================================================

export class UserRepository implements IUserRepository {
  constructor(private db: DatabaseInstance) {}

  /**
   * Create a new user using Better-Auth
   */
  async create(data: CreateUserData): Promise<User> {
    const validatedEmail = sanitizeInput.email(data.email)
    const validatedName = sanitizeInput.name(data.name)
    const validatedPassword = sanitizeInput.password(data.password)

    // Check if user already exists
    const existingUser = await this.findByEmail(validatedEmail)
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS)
    }

    // Create user via Better-Auth API
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
  async findById(id: string): Promise<User | undefined> {
    const validatedId = id.trim()
    if (!validatedId) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    const [userRecord] = await this.db.select().from(user).where(eq(user.id, validatedId)).limit(1)

    return userRecord
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const validatedEmail = sanitizeInput.email(email)

    const [userRecord] = await this.db.select().from(user).where(eq(user.email, validatedEmail)).limit(1)

    return userRecord
  }

  /**
   * Update user data
   */
  async update(id: string, data: Partial<UpdateUserData>): Promise<User> {
    const validatedId = id.trim()
    if (!validatedId) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    // Check if user exists
    const existingUser = await this.findById(validatedId)
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }

    // Prepare update data
    const updateData: Partial<User> = {
      updatedAt: new Date()
    }

    if (data.name) {
      updateData.name = sanitizeInput.name(data.name)
    }
    if (data.email) {
      updateData.email = sanitizeInput.email(data.email)
    }
    if (data.image !== undefined) {
      updateData.image = data.image
    }

    const [updatedUser] = await this.db.update(user).set(updateData).where(eq(user.id, validatedId)).returning()

    if (!updatedUser) {
      throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    return updatedUser
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<boolean> {
    const validatedId = id.trim()
    if (!validatedId) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    const result = await this.db.delete(user).where(eq(user.id, validatedId))

    return result.rowCount !== null && result.rowCount > 0
  }

  /**
   * Find all users (with pagination support)
   */
  async findAll(limit = 10, offset = 0): Promise<User[]> {
    return await this.db.select().from(user).limit(limit).offset(offset).orderBy(user.createdAt)
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    const result = await this.db.select({ count: user.id }).from(user)

    return result.length
  }
}
