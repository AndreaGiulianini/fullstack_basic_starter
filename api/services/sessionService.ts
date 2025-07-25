import { eq } from 'drizzle-orm'
import type { CreateSessionData, Session } from '../schemas'
import { session } from '../schemas'
import { AppError, NotFoundError } from '../utils/appError'
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants'
import db from '../utils/db'

// =============================================================================
// SESSION SERVICE - DIRECT DRIZZLE ACCESS
// Simplified session management with direct database access
// =============================================================================

/**
 * Create a new session
 */
export async function createSession(data: CreateSessionData): Promise<Session> {
  try {
    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const [newSession] = await db
      .insert(session)
      .values({
        id: sessionId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    if (!newSession) {
      throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    return newSession
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error creating session:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Find session by ID
 */
export async function findSessionById(id: string): Promise<Session | undefined> {
  try {
    if (!id?.trim()) {
      throw new AppError('Invalid session ID', HTTP_STATUS.BAD_REQUEST)
    }

    const [foundSession] = await db.select().from(session).where(eq(session.id, id)).limit(1)

    return foundSession
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error finding session by ID:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Find sessions by user ID
 */
export async function findSessionsByUserId(userId: string): Promise<Session[]> {
  try {
    if (!userId?.trim()) {
      throw new AppError('Invalid user ID', HTTP_STATUS.BAD_REQUEST)
    }

    const sessions = await db.select().from(session).where(eq(session.userId, userId))

    return sessions
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error finding sessions by user ID:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Update session
 */
export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  try {
    if (!id?.trim()) {
      throw new AppError('Invalid session ID', HTTP_STATUS.BAD_REQUEST)
    }

    // Check if session exists
    const existingSession = await findSessionById(id)
    if (!existingSession) {
      throw new NotFoundError('Session not found')
    }

    const [updatedSession] = await db
      .update(session)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(session.id, id))
      .returning()

    if (!updatedSession) {
      throw new AppError('Failed to update session', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    return updatedSession
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error updating session:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Delete session by ID
 */
export async function deleteSession(id: string): Promise<boolean> {
  try {
    if (!id?.trim()) {
      throw new AppError('Invalid session ID', HTTP_STATUS.BAD_REQUEST)
    }

    // Check if session exists
    const existingSession = await findSessionById(id)
    if (!existingSession) {
      throw new NotFoundError('Session not found')
    }

    const result = await db.delete(session).where(eq(session.id, id))

    return result.rowCount !== null && result.rowCount > 0
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error deleting session:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteSessionsByUserId(userId: string): Promise<boolean> {
  try {
    if (!userId?.trim()) {
      throw new AppError('Invalid user ID', HTTP_STATUS.BAD_REQUEST)
    }

    const result = await db.delete(session).where(eq(session.userId, userId))

    return result.rowCount !== null && result.rowCount > 0
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    console.error('Error deleting sessions by user ID:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Check if session exists
 */
export async function sessionExists(id: string): Promise<boolean> {
  try {
    const foundSession = await findSessionById(id)
    return !!foundSession
  } catch (_error) {
    return false
  }
}

/**
 * Get all sessions (with pagination)
 */
export async function findAllSessions(options: { limit?: number; offset?: number } = {}): Promise<Session[]> {
  try {
    const { limit = 10, offset = 0 } = options

    const sessions = await db.select().from(session).limit(limit).offset(offset)

    return sessions
  } catch (error) {
    console.error('Error finding all sessions:', error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}
