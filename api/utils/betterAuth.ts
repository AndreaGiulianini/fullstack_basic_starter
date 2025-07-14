import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { bearer } from 'better-auth/plugins'
import { account, session, user, verification } from '../schemas/betterAuthSchema'
import db from './db'

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
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false
    }
  }
})
