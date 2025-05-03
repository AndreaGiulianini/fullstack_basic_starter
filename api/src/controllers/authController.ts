import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { users } from '../models/user'
import db from '../utils/db'

export const login = async (email: string, password: string, generateTokens: Function) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) {
      return Error('User not found')
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return Error('Invalid credentials')
    }

    // Generate tokens
    const token = await generateTokens({ id: user.id, email: user.email })
    return token
  } catch (error) {
    console.log(error)
    return Error('Database error')
  }
}

export const refreshToken = async (
  refreshToken: string,
  verifyRefreshToken: Function,
  revokeRefreshToken: Function,
  generateTokens: Function
) => {
  try {
    const decoded = await verifyRefreshToken(refreshToken)
    await revokeRefreshToken(decoded.id) // Revoke old refresh token
    const token = await generateTokens({ id: decoded.id, email: decoded.email })
    return token
  } catch (error) {
    console.log(error)
    return Error('Invalid refresh token')
  }
}

export const profile = async (userId: string) => {
  try {
    const [userProfile] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    return userProfile
  } catch (error) {
    console.log(error)
    return Error('Database error')
  }
}
