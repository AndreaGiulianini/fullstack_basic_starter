import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { bearer } from 'better-auth/plugins'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as betterAuthModels from '../database-models/betterAuthModels'

// Extract models for easier reference
const { account, session, user, verification } = betterAuthModels

// Database connection
const url = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const db = drizzle(url, {
  schema: {
    ...betterAuthModels
  }
})

// Better-Auth configuration
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification
    }
  }),
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (matches current refresh token)
    updateAge: 60 * 60 * 24 // 1 day
  },
  secret: process.env.JWT_SECRET || 'superdupersecret',
  baseURL: process.env.BASE_URL || 'http://localhost',
  advanced: {
    useSecureCookies: process.env.ENV === 'production',
    crossSubDomainCookies: {
      enabled: false
    }
  }
})

export default db
