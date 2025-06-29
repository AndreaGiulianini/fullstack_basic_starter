import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { AuthenticationError, NotFoundError } from '../errors/appError'
import { users } from '../models/user'
import type {
  GenerateTokensFunction,
  JWTPayload,
  RevokeRefreshTokenFunction,
  TokenPair,
  VerifyRefreshTokenFunction
} from '../types/auth'
import db from '../utils/db'
import { asyncHandler } from '../utils/errorHelpers'
import { sanitizeInput } from '../utils/validation'

export const login = asyncHandler(
  async (email: string, password: string, generateTokens: GenerateTokensFunction): Promise<TokenPair> => {
    // Validate and sanitize email
    const validatedEmail = sanitizeInput.email(email)

    const [user] = await db.select().from(users).where(eq(users.email, validatedEmail)).limit(1)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new AuthenticationError('Invalid credentials')
    }

    // Generate tokens
    const jwtPayload: JWTPayload = { id: user.id, email: validatedEmail }
    const tokens = await generateTokens(jwtPayload)
    return tokens
  }
)

export const refreshToken = asyncHandler(
  async (
    refreshToken: string,
    verifyRefreshToken: VerifyRefreshTokenFunction,
    revokeRefreshToken: RevokeRefreshTokenFunction,
    generateTokens: GenerateTokensFunction
  ): Promise<TokenPair> => {
    const decoded = await verifyRefreshToken(refreshToken)
    await revokeRefreshToken(decoded.id) // Revoke old refresh token
    const tokens = await generateTokens(decoded)
    return tokens
  }
)

export const profile = asyncHandler(async (userId: string) => {
  // Validate UUID
  const validatedUserId = sanitizeInput.uuid(userId)

  const [userProfile] = await db.select().from(users).where(eq(users.id, validatedUserId)).limit(1)
  if (!userProfile) {
    throw new NotFoundError('User profile not found')
  }
  // Return only safe user data
  return {
    id: userProfile.id,
    email: userProfile.email,
    name: userProfile.name
  }
})
