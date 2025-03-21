import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { users } from '../models/user'
import db from '../utils/db'

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as { email: string; password: string }

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) {
      return reply.status(400).send({ message: 'User not found' })
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return reply.status(401).send({ message: 'Invalid credentials' })
    }

    // Generate tokens
    const tokens = await request.server.generateTokens({ id: user.id, email: user.email })
    reply.send({ success: true, ...tokens })
  } catch (error) {
    console.log(error)
    reply.status(500).send({ message: 'Database error' })
  }
}

export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as { refreshToken: string }

  try {
    const decoded = await request.server.verifyRefreshToken(refreshToken)
    await request.server.revokeRefreshToken(decoded.id) // Revoke old refresh token
    const tokens = await request.server.generateTokens({ id: decoded.id, email: decoded.email })
    reply.send({ success: true, ...tokens })
  } catch (error) {
    console.log(error)
    reply.status(401).send({ message: 'Invalid refresh token' })
  }
}

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const [userProfile] = await db.select().from(users).where(eq(users.id, request.user.id)).limit(1)
    reply.send({ success: true, user: userProfile })
  } catch (error) {
    console.log(error)
    reply.status(500).send({ message: 'Database error' })
  }
}
