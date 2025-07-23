import type { DatabaseInstance, ISessionRepository, IUserRepository, UpdateUserData } from '../types'
import { SessionRepository } from './sessionRepository'
import { UserRepository } from './userRepository'

// =============================================================================
// UNIT OF WORK PATTERN
// Manages transactions and coordinates repository operations
// =============================================================================

export class UnitOfWork {
  private _userRepository: IUserRepository | null = null
  private _sessionRepository: ISessionRepository | null = null
  private _isInTransaction = false

  constructor(private db: DatabaseInstance) {}

  // =============================================================================
  // REPOSITORY GETTERS
  // =============================================================================

  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository(this.db)
    }
    return this._userRepository
  }

  get sessionRepository(): ISessionRepository {
    if (!this._sessionRepository) {
      this._sessionRepository = new SessionRepository(this.db)
    }
    return this._sessionRepository
  }

  // =============================================================================
  // TRANSACTION MANAGEMENT
  // =============================================================================

  /**
   * Execute operations within a database transaction
   */
  async withTransaction<T>(operation: (uow: UnitOfWork) => Promise<T>): Promise<T> {
    if (this._isInTransaction) {
      // If already in transaction, just execute the operation
      return await operation(this)
    }

    return await this.db.transaction(async (tx) => {
      // Create a new UnitOfWork with the transaction instance
      const transactionalUoW = new UnitOfWork(tx as DatabaseInstance)
      transactionalUoW._isInTransaction = true

      try {
        const result = await operation(transactionalUoW)
        return result
      } catch (error) {
        // Transaction will be automatically rolled back
        console.error('Transaction failed:', error)
        throw error
      }
    })
  }

  /**
   * Execute multiple operations in a transaction with rollback on any failure
   */
  async executeInTransaction<T>(operations: Array<(uow: UnitOfWork) => Promise<T>>): Promise<T[]> {
    return await this.withTransaction(async (uow) => {
      const results: T[] = []

      for (const operation of operations) {
        const result = await operation(uow)
        results.push(result)
      }

      return results
    })
  }

  // =============================================================================
  // COMMON BUSINESS OPERATIONS
  // Examples of coordinated operations across repositories
  // =============================================================================

  /**
   * Create user and initial session in a single transaction
   */
  async createUserWithSession(
    userData: {
      name: string
      email: string
      password: string
    },
    sessionData: {
      token: string
      expiresAt: Date
      ipAddress?: string
      userAgent?: string
    }
  ) {
    return await this.withTransaction(async (uow) => {
      // Create user first
      const user = await uow.userRepository.create(userData)

      // Create session for the user
      const session = await uow.sessionRepository.create({
        ...sessionData,
        userId: user.id
      })

      return { user, session }
    })
  }

  /**
   * Delete user and all associated sessions
   */
  async deleteUserWithSessions(userId: string): Promise<boolean> {
    return await this.withTransaction(async (uow) => {
      // Get all user sessions first
      const sessions = await uow.sessionRepository.findByUserId(userId)

      // Delete all sessions
      for (const session of sessions) {
        await uow.sessionRepository.delete(session.id)
      }

      // Delete the user
      return await uow.userRepository.delete(userId)
    })
  }

  /**
   * Update user and create audit log
   */
  async updateUserWithAudit(
    userId: string,
    updateData: UpdateUserData,
    _auditInfo: { action: string; performedBy: string; timestamp: Date }
  ) {
    return await this.withTransaction(async (uow) => {
      // Update user
      const updatedUser = await uow.userRepository.update(userId, updateData)

      // Create audit log (you'd need an AuditRepository)
      // await uow.auditRepository.create({
      //   entityType: 'User',
      //   entityId: userId,
      //   action: auditInfo.action,
      //   performedBy: auditInfo.performedBy,
      //   timestamp: auditInfo.timestamp,
      //   changes: updateData
      // })

      return updatedUser
    })
  }

  // =============================================================================
  // BATCH OPERATIONS
  // =============================================================================

  /**
   * Batch create multiple users with validation
   */
  async batchCreateUsers(
    usersData: Array<{
      name: string
      email: string
      password: string
    }>
  ) {
    return await this.withTransaction(async (uow) => {
      const results = []

      for (const userData of usersData) {
        try {
          const user = await uow.userRepository.create(userData)
          results.push({ success: true, user, email: userData.email })
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            email: userData.email
          })
        }
      }

      return results
    })
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Check if currently in a transaction
   */
  get isInTransaction(): boolean {
    return this._isInTransaction
  }

  /**
   * Reset repository instances (useful for testing)
   */
  reset(): void {
    this._userRepository = null
    this._sessionRepository = null
    this._isInTransaction = false
  }
}
