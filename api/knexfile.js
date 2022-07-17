import path from 'path'
import { fileURLToPath } from 'url'

import { knex_config } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const typeCast = (field, next) => {
  if (field.type == 'TINY' && field.length == 1) {
    // without this, boolean db field wants true/false but return 1/0
    const value = field.string()
    return value ? value == '1' : null // 1 = true, 0 = false, null = null
  } else if (field.type == 'NEWDECIMAL' || field.type == 'DECIMAL') {
    // without this, decimal values are returned as string but we want them to be returned as a float
    const parsed = parseFloat(field.string())
    return Number.isNaN(parsed) ? null : parsed
  }
  return next()
}

const development = {
  client: 'mysql2',
  connection: {
    host: knex_config.development.host,
    port: '3306',
    user: knex_config.development.user,
    password: knex_config.development.password,
    database: 'demo',
    typeCast: typeCast,
  },
  debug: false,
  pool: { min: 2, max: 5 },
  migrations: {
    directory: __dirname + '/migrations',
  },
  seeds: {
    directory: __dirname + '/seeds',
  },
}

const staging = {
  client: 'mysql2',
  connection: {
    host: knex_config.staging.host,
    port: '3306',
    user: knex_config.staging.user,
    password: knex_config.staging.password,
    database: 'demo',
    // without this, boolean db field wants true/false but return 1/0
    typeCast: typeCast,
  },
  debug: false,
  pool: { min: 2, max: 5 },
  migrations: {
    directory: __dirname + '/migrations',
  },
  seeds: {
    directory: __dirname + '/seeds',
  },
}

const testing = {
  client: 'mysql2',
  connection: {
    host: knex_config.testing.host,
    port: '3306',
    user: knex_config.testing.user,
    password: knex_config.testing.password,
    database: 'demo',
    // without this, boolean db field wants true/false but return 1/0
    typeCast: typeCast,
  },
  debug: false,
  pool: { min: 2, max: 5 },
  migrations: {
    directory: __dirname + '/migrations',
  },
  seeds: {
    directory: __dirname + '/seeds',
  },
}

const production = {
  client: 'mysql2',
  connection: {
    host: knex_config.production.host,
    user: knex_config.production.user,
    password: knex_config.production.password,
    database: 'demo',
    typeCast: typeCast,
  },
  debug: false,
  pool: { min: 2, max: 5 },
  migrations: {
    directory: __dirname + '/migrations',
  },
  seeds: {
    directory: __dirname + '/seeds',
  },
}

export { development, staging, testing, production }
