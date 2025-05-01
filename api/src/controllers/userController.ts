import { createUser, getUser } from '../models/user'
import db from '../utils/db'

export const getUserHandler = async (userId: string) => {
  const user = await getUser(db, userId)
  return user
}

export const createUserHandler = async (name: string, email: string, password: string) => {
  const user = await createUser(db, name, email, password)
  return user
}
