import bcrypt from 'bcrypt'
import * as z from 'zod/v4'
import { BOOLEAN_STRINGS, ERROR_MESSAGES, SECURITY } from '../constants'
import { emailSchema, passwordSchema } from './common'

/**
 * Transform that hashes a password using bcrypt
 */
export const hashedPasswordSchema = passwordSchema.transform(async (password) => {
  const saltRounds = SECURITY.BCRYPT_SALT_ROUNDS
  return await bcrypt.hash(password, saltRounds)
})

/**
 * Transform that normalizes email (use this instead of duplicating emailSchema)
 */
export const normalizedEmailSchema = emailSchema

/**
 * Transform that sanitizes and validates names
 */
export const sanitizedNameSchema = z
  .string()
  .min(1, ERROR_MESSAGES.NAME_REQUIRED)
  .max(255, ERROR_MESSAGES.NAME_TOO_LONG)
  .transform((name) => name.trim())

/**
 * Transform for UUID validation and normalization
 */
export const normalizedUuidSchema = z
  .uuid(ERROR_MESSAGES.INVALID_UUID_FORMAT)
  .transform((uuid) => uuid.toLowerCase().trim())

/**
 * Transform for dates (parse common formats)
 */
export const flexibleDateSchema = z.union([
  z.date(),
  z.string().transform((str) => {
    const date = new Date(str)
    if (Number.isNaN(date.getTime())) {
      throw new Error(ERROR_MESSAGES.INVALID_DATE_FORMAT)
    }
    return date
  }),
  z.number().transform((timestamp) => new Date(timestamp))
])

/**
 * Transform for boolean values from various inputs
 */
export const flexibleBooleanSchema = z.union([
  z.boolean(),
  z.string().transform((str) => {
    const lower = str.toLowerCase().trim()
    if ((BOOLEAN_STRINGS.TRUE_VALUES as readonly string[]).includes(lower)) return true
    if ((BOOLEAN_STRINGS.FALSE_VALUES as readonly string[]).includes(lower)) return false
    throw new Error(ERROR_MESSAGES.INVALID_BOOLEAN_VALUE)
  }),
  z.number().transform((num) => Boolean(num))
])
