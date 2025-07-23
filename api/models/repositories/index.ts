import db from '../../utils/db'
import type { DatabaseInstance, ISessionRepository, IUserRepository } from '../types'
import { SessionRepository } from './sessionRepository'
import { UserRepository } from './userRepository'

// =============================================================================
// REPOSITORY FACTORY
// Centralized access to all repositories
// =============================================================================

class RepositoryFactory {
  private _userRepository: IUserRepository | null = null
  private _sessionRepository: ISessionRepository | null = null

  constructor(private database: DatabaseInstance = db) {}

  /**
   * Get User Repository instance (singleton)
   */
  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository(this.database)
    }
    return this._userRepository
  }

  /**
   * Get Session Repository instance (singleton)
   */
  get sessionRepository(): ISessionRepository {
    if (!this._sessionRepository) {
      this._sessionRepository = new SessionRepository(this.database)
    }
    return this._sessionRepository
  }

  /**
   * Reset all repository instances (useful for testing)
   */
  reset(): void {
    this._userRepository = null
    this._sessionRepository = null
  }

  /**
   * Create factory with custom database instance (useful for testing)
   */
  static withDatabase(database: DatabaseInstance): RepositoryFactory {
    return new RepositoryFactory(database)
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Default repository factory instance
export const repositories = new RepositoryFactory()

// Export individual repository classes for direct instantiation if needed
export { SessionRepository, UserRepository }

// Export the factory class for testing purposes
export { RepositoryFactory }

// Export repository interfaces
export type { ISessionRepository, IUserRepository }

// Convenience exports for direct access
export const userRepository = repositories.userRepository
export const sessionRepository = repositories.sessionRepository
