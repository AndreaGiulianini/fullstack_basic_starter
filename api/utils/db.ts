import { drizzle } from 'drizzle-orm/node-postgres'
import * as betterAuthSchema from '../schemas/betterAuthSchema'

const url = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
export default drizzle(url, {
  schema: {
    ...betterAuthSchema
  }
})
