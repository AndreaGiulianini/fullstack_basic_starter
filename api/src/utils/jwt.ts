import jwt from '@fastify/jwt'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { CACHE_KEYS, ERROR_MESSAGES, SECURITY } from '../constants'
import type {
  GenerateTokensFunction,
  JWTPayload,
  RevokeRefreshTokenFunction,
  TokenPair,
  VerifyRefreshTokenFunction
} from '../types/auth'
import type { PreHandler } from '../types/fastify'
import valkey from './valkey'

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(jwt, {
    secret: SECURITY.JWT_SECRET
  })

  const authenticate: PreHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({ 
        success: false, 
        message: ERROR_MESSAGES.AUTHENTICATION_FAILED 
      })
    }
  }

  const generateTokens: GenerateTokensFunction = async (user: JWTPayload): Promise<TokenPair> => {
    const accessToken = fastify.jwt.sign(user, { expiresIn: SECURITY.TOKEN_EXPIRY })
    const refreshToken = fastify.jwt.sign(user, { expiresIn: SECURITY.REFRESH_TOKEN_EXPIRY })
    await valkey.set(`${CACHE_KEYS.REFRESH_TOKEN_PREFIX}${user.id}`, refreshToken)
    return { accessToken, refreshToken }
  }

  const verifyRefreshToken: VerifyRefreshTokenFunction = async (refreshToken: string): Promise<JWTPayload> => {
    try {
      const decoded = fastify.jwt.verify<JWTPayload>(refreshToken)
      const storedToken = await valkey.get(`${CACHE_KEYS.REFRESH_TOKEN_PREFIX}${decoded.id}`)
      if (storedToken !== refreshToken) {
        throw new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN)
      }
      return decoded
    } catch (err) {
      throw new Error(`${ERROR_MESSAGES.INVALID_REFRESH_TOKEN} ${err}`)
    }
  }

  const revokeRefreshToken: RevokeRefreshTokenFunction = async (userId: string): Promise<void> => {
    await valkey.del(`${CACHE_KEYS.REFRESH_TOKEN_PREFIX}${userId}`)
  }

  fastify.decorate('authenticate', authenticate)
  fastify.decorate('generateTokens', generateTokens)
  fastify.decorate('verifyRefreshToken', verifyRefreshToken)
  fastify.decorate('revokeRefreshToken', revokeRefreshToken)
})

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: PreHandler
    generateTokens: GenerateTokensFunction
    verifyRefreshToken: VerifyRefreshTokenFunction
    revokeRefreshToken: RevokeRefreshTokenFunction
  }
}
