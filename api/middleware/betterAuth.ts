import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthenticationError } from '../utils/appError'
import { ERROR_MESSAGES } from '../utils/constants'
import { auth } from '../utils/db'
import logUtils from '../utils/logger'
import type { AuthenticatedFastifyRequest, AuthenticatedUser, ExtendedFastifyRequest } from '../utils/schemas'

// =============================================================================
// AUTHENTICATION MIDDLEWARE
// =============================================================================

export const betterAuthMiddleware = async (request: FastifyRequest, _reply: FastifyReply) => {
  const startTime = Date.now()

  try {
    // Get session from better-auth with timeout
    const sessionPromise = auth.api.getSession({
      headers: request.headers as unknown as Headers
    })

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Authentication timeout')), 5000)
    })

    const session = (await Promise.race([sessionPromise, timeoutPromise])) as {
      user: { id: string; email: string; name?: string }
    } | null

    if (!session) {
      // Log failed authentication attempt
      logUtils.logAuth({
        event: 'login',
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        success: false,
        reason: 'No valid session found'
      })

      throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED)
    }

    // Validate session data
    if (!session.user || !session.user.id || !session.user.email) {
      logUtils.logAuth({
        event: 'login',
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        success: false,
        reason: 'Invalid session data'
      })

      throw new AuthenticationError(ERROR_MESSAGES.INVALID_SESSION_DATA)
    }

    // Attach user to request
    const authenticatedRequest = request as AuthenticatedFastifyRequest
    authenticatedRequest.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    } as AuthenticatedUser

    // Log successful authentication
    logUtils.logAuth({
      event: 'login',
      userId: session.user.id,
      email: session.user.email,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      success: true
    })

    // Log performance metrics
    const duration = Date.now() - startTime
    logUtils.logPerformance({
      operation: 'authentication',
      duration,
      requestId: (request as ExtendedFastifyRequest).requestId
    })
  } catch (error) {
    // Log authentication failure
    logUtils.logAuth({
      event: 'login',
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      success: false,
      reason: error instanceof Error ? error.message : 'Unknown error'
    })

    // Log security event for multiple failed attempts
    logUtils.logSecurity({
      event: 'access_denied',
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      details: 'Authentication failed',
      severity: 'medium'
    })

    if (error instanceof AuthenticationError) {
      throw error
    }

    throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_FAILED_GENERIC)
  }
}

// =============================================================================
// OPTIONAL AUTHENTICATION MIDDLEWARE
// =============================================================================

// Middleware for routes that can work with or without authentication
export const optionalAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await betterAuthMiddleware(request, reply)
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    if (error instanceof AuthenticationError) {
      // Log that optional auth was attempted but failed
      logUtils.logAuth({
        event: 'login',
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        success: false,
        reason: 'Optional authentication failed'
      })
    }
  }
}

// =============================================================================
// ROLE-BASED AUTHORIZATION MIDDLEWARE
// =============================================================================

export const requireRole = (requiredRole: 'admin' | 'user') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // First ensure user is authenticated
    await betterAuthMiddleware(request, reply)

    const authenticatedRequest = request as AuthenticatedFastifyRequest
    const user = authenticatedRequest.user

    // For now, we'll implement a simple role check
    // In a real application, you'd fetch user roles from database
    const userRole = user.email?.includes('admin') ? 'admin' : 'user'

    if (userRole !== requiredRole && requiredRole === 'admin') {
      logUtils.logSecurity({
        event: 'access_denied',
        userId: user.id,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        details: `User attempted to access ${requiredRole} endpoint`,
        severity: 'high'
      })

      throw new AuthenticationError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
    }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default betterAuthMiddleware
