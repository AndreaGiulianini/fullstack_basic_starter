import type { FastifyReply, FastifyRequest } from 'fastify'
import { createUser, getUser } from '../models/user'
import db from '../utils/db'

export const getUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.params as { userId: string }
  const user = await getUser(db, userId)
  reply.send({ succes: true, user })
}

export const createUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = request.body as { name: string; email: string; password: string }
  const user = await createUser(db, name, email, password)
  reply.send({ success: true, user })
}
