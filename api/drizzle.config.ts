import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/models',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  }
})
