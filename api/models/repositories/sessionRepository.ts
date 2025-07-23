import { eq } from 'drizzle-orm'
import { AppError } from '../../utils/appError'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../utils/constants'
import { session } from '../schema'
import type { CreateSessionData, DatabaseInstance, ISessionRepository, Session } from '../types'

// =============================================================================
// SESSION REPOSITORY IMPLEMENTATION
// Handles all session-related database operations
// =============================================================================

export class SessionRepository implements ISessionRepository {
  constructor(private db: DatabaseInstance) {}

  /**
   * Find session by token
   */
  async findByToken(token: string): Promise<Session | undefined> {
    if (!token.trim()) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    const [sessionRecord] = await this.db.select().from(session).where(eq(session.token, token)).limit(1)

    return sessionRecord
  }

  /**
   * Find all sessions for a user
   */
  async findByUserId(userId: string): Promise<Session[]> {
    if (!userId.trim()) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    return await this.db.select().from(session).where(eq(session.userId, userId)).orderBy(session.createdAt)
  }

  /**
   * Create a new session
   */
  async create(data: CreateSessionData): Promise<Session> {
    const [newSession] = await this.db
      .insert(session)
      .values({
        id: crypto.randomUUID(),
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    if (!newSession) {
      throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    return newSession
  }

  /**
   * Delete session by ID
   */
  async delete(id: string): Promise<boolean> {
    if (!id.trim()) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    const result = await this.db.delete(session).where(eq(session.id, id))

    return result.rowCount !== null && result.rowCount > 0
  }

  /**
   * Delete expired sessions
   */
  async deleteExpired(): Promise<number> {
    const result = await this.db.delete(session).where(eq(session.expiresAt, new Date()))

    return result.rowCount || 0
  }

  /**
   * Delete all sessions for a user
   */
  async deleteByUserId(userId: string): Promise<number> {
    if (!userId.trim()) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST_DATA, HTTP_STATUS.BAD_REQUEST)
    }

    const result = await this.db.delete(session).where(eq(session.userId, userId))

    return result.rowCount || 0
  }
}
