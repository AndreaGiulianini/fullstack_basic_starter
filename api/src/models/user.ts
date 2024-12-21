import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export type User = InferSelectModel<typeof users>

export async function createUser(db: NodePgDatabase, name: string, email: string, password: string) {
  try {
    // Check if the user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existingUser.length > 0) {
      return Error('User already exist')
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert the new user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword
      })
      .returning()

    return newUser
  } catch (error) {
    console.log(error)
    return Error('Generic error')
  }
}

export async function getUser(db: NodePgDatabase, id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user
}
