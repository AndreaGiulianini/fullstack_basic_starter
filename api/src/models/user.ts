import bcrypt from 'bcrypt'
import type { InferSelectModel } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { DATABASE, MESSAGES, SECURITY } from '../constants'
import { ConflictError, DatabaseError } from '../errors/appError'
import { sanitizeInput } from '../utils/validation'

export const users = pgTable(DATABASE.TABLE_NAMES.USERS, {
  id: uuid().defaultRandom().primaryKey(),
  name: text(DATABASE.COLUMN_NAMES.NAME),
  email: varchar(DATABASE.COLUMN_NAMES.EMAIL, { length: DATABASE.CONSTRAINTS.EMAIL_MAX_LENGTH }).notNull(),
  password: varchar(DATABASE.COLUMN_NAMES.PASSWORD, { length: DATABASE.CONSTRAINTS.PASSWORD_MAX_LENGTH }).notNull(),
  createdAt: timestamp(DATABASE.COLUMN_NAMES.CREATED_AT).notNull().defaultNow()
})

export type User = InferSelectModel<typeof users>

export async function createUser(db: NodePgDatabase, name: string, email: string, password: string): Promise<User> {
  // Validate and sanitize input using Zod schemas
  const validatedEmail = sanitizeInput.email(email)
  const validatedName = sanitizeInput.name(name)
  const validatedPassword = sanitizeInput.password(password)

  // Check if the user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, validatedEmail)).limit(1)
  if (existingUser.length > 0) {
    throw new ConflictError(MESSAGES.USER_ALREADY_EXISTS)
  }

  try {
    // Hash the password
    const saltRounds = SECURITY.BCRYPT_SALT_ROUNDS
    const hashedPassword = await bcrypt.hash(validatedPassword, saltRounds)

    // Insert the new user
    const [newUser] = await db
      .insert(users)
      .values({
        name: validatedName,
        email: validatedEmail,
        password: hashedPassword
      })
      .returning()

    return newUser
  } catch (_error) {
    throw new DatabaseError()
  }
}

export async function getUser(db: NodePgDatabase, id: string): Promise<User | undefined> {
  // Validate UUID
  const validatedId = sanitizeInput.uuid(id, 'id')

  const [user] = await db.select().from(users).where(eq(users.id, validatedId)).limit(1)
  return user
}
