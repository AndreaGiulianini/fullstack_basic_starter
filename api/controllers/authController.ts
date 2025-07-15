import { eq } from 'drizzle-orm'
import { user } from '../database-models/betterAuthModels'
import { NotFoundError } from '../errors/appError'
import db from '../utils/db'

export const profile = async (userId: string) => {
  // Validate text ID (better-auth uses text IDs, not UUIDs)
  const validatedUserId = userId.trim()
  if (!validatedUserId) {
    throw new NotFoundError('Invalid user ID')
  }

  const [userProfile] = await db.select().from(user).where(eq(user.id, validatedUserId)).limit(1)
  if (!userProfile) {
    throw new NotFoundError('User profile not found')
  }
  // Return only safe user data
  return {
    id: userProfile.id,
    email: userProfile.email,
    name: userProfile.name
  }
}
