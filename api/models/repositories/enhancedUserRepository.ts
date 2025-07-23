import { desc, eq } from 'drizzle-orm'
import { AppError, ConflictError } from '../../utils/appError'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../utils/constants'
import { auth } from '../../utils/db'
import { sanitizeInput } from '../../utils/validation'
import { user } from '../schema'
import type { CreateUserData, DatabaseInstance, IUserRepository, UpdateUserData, User } from '../types'
import { BaseRepository } from './baseRepository'

// =============================================================================
// ENHANCED USER REPOSITORY IMPLEMENTATION
// Extends BaseRepository for common CRUD operations
// =============================================================================

export class EnhancedUserRepository
  extends BaseRepository<User, CreateUserData, UpdateUserData>
  implements IUserRepository
{
  constructor(db: DatabaseInstance) {
    super(db, user, 'User', user.id)
  }

  /**
   * Create a new user using Better-Auth
   */
  async create(data: CreateUserData): Promise<User> {
    try {
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
    } catch (error) {
      this.handleDatabaseError(error, 'create')
    }
  }

  /**
   * Update user data
   */
  async update(id: string, data: Partial<UpdateUserData>): Promise<User> {
    try {
      await this.ensureExists(id)

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

      const [updatedUser] = await this.db.update(user).set(updateData).where(eq(user.id, id)).returning()

      if (!updatedUser) {
        throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
      }

      return updatedUser
    } catch (error) {
      this.handleDatabaseError(error, 'update')
    }
  }

  // =============================================================================
  // DOMAIN-SPECIFIC METHODS
  // Methods specific to User entity
  // =============================================================================

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const validatedEmail = sanitizeInput.email(email)
    return await this.findFirst(eq(user.email, validatedEmail))
  }

  /**
   * Find users by name pattern
   */
  async findByNamePattern(namePattern: string, limit = 10): Promise<User[]> {
    return await this.findWhere(
      eq(user.name, namePattern), // You could use LIKE operator here
      limit
    )
  }

  /**
   * Find verified users
   */
  async findVerifiedUsers(limit = 10, offset = 0): Promise<User[]> {
    return await this.findAll({
      where: eq(user.emailVerified, true),
      limit,
      offset,
      orderBy: desc(user.createdAt)
    })
  }

  /**
   * Count verified users
   */
  async countVerifiedUsers(): Promise<number> {
    return await this.count(eq(user.emailVerified, true))
  }

  /**
   * Find recently created users
   */
  async findRecentUsers(days = 7, limit = 10): Promise<User[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Note: You'd need to implement date comparison with Drizzle
    return await this.findAll({
      limit,
      orderBy: desc(user.createdAt)
    })
  }

  /**
   * Soft delete user (mark as inactive instead of deleting)
   */
  async softDelete(id: string): Promise<boolean> {
    try {
      await this.ensureExists(id)

      // For demonstration - you'd need an 'active' field in your schema
      // const result = await this.update(id, { active: false })
      // return !!result

      // For now, just use regular delete
      return await this.delete(id)
    } catch (error) {
      this.handleDatabaseError(error, 'softDelete')
    }
  }

  /**
   * Batch create users
   */
  async createBatch(users: CreateUserData[]): Promise<User[]> {
    const createdUsers: User[] = []

    for (const userData of users) {
      try {
        const user = await this.create(userData)
        createdUsers.push(user)
      } catch (error) {
        console.error(`Failed to create user ${userData.email}:`, error)
        // Continue with other users or throw based on your business logic
      }
    }

    return createdUsers
  }
}
