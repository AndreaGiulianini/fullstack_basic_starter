import jwt from '@fastify/jwt'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import valkey from './valkey'

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(jwt, {
    secret: 'superdupersecret'
  })

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send({ success: false, message: err })
    }
  })

  fastify.decorate('generateTokens', async (user: { id: string; email: string }) => {
    const accessToken = fastify.jwt.sign(user, { expiresIn: '15m' })
    const refreshToken = fastify.jwt.sign(user, { expiresIn: '7d' })
    await valkey.set(`refresh_${user.id}`, refreshToken)
    return { accessToken, refreshToken }
  })

  fastify.decorate('verifyRefreshToken', async (refreshToken: string): Promise<{ id: string; email: string }> => {
    try {
      const decoded = fastify.jwt.verify<{ id: string; email: string }>(refreshToken)
      const storedToken = await valkey.get(`refresh_${decoded.id}`)
      if (storedToken !== refreshToken) {
        throw new Error('Invalid refresh token')
      }
      return decoded
    } catch (err) {
      throw new Error(`Invalid refresh token ${err}`)
    }
  })

  fastify.decorate('revokeRefreshToken', async (userId: string) => {
    await valkey.del(`refresh_${userId}`)
  })
})

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => unknown
    generateTokens: (user: { id: string; email: string }) => Promise<{ accessToken: string; refreshToken: string }>
    verifyRefreshToken: (refreshToken: string) => Promise<{ id: string; email: string }>
    revokeRefreshToken: (userId: string) => Promise<void>
  }
}
