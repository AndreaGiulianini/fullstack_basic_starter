import Knex from 'knex'
import { Model } from 'objection'

import { development, production, staging, testing } from '../knexfile.js'

let config = development
switch (process.env.ENVIRONMENT) {
  case 'development':
    config = development
    break
  case 'staging':
    config = staging
    break
  case 'testing':
    config = testing
    break
  case 'production':
    config = production
    break
}

const configWithoutDb = { ...config, connection: { ...config.connection, database: undefined } }
const databaseName = config.connection.database

const MAX_CONNECTION_ATTEMPTS = Infinity
const CONNECTION_RETRY_AFTER = 3 //s

const isConnected = async (attempt = 1) => {
  let connection
  try {
    connection = Knex(configWithoutDb)
    await connection.raw('SELECT 1;')
    connection.destroy()
    console.log('API successfully connected to database')
    return true
  } catch (error) {
    if (connection) {
      connection.destroy()
    }
    if (attempt <= MAX_CONNECTION_ATTEMPTS) {
      console.error(`API unable to connect to database. Attempt: ${attempt}/${MAX_CONNECTION_ATTEMPTS}`)
      await new Promise((resolve) => setTimeout(resolve, CONNECTION_RETRY_AFTER * 1000))
      return await isConnected(attempt + 1)
    } else {
      console.error('API failed connect to database')
      console.error(error)
      return false
    }
  }
}

const setupDatabase = async () => {
  try {
    const connection = Knex(configWithoutDb)
    const res = await connection.raw(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}';`,
    )
    const alreadyExists = res[0].length > 0
    if (!alreadyExists) {
      // database creation
      await connection.raw(
        `CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      )
    }
    connection.destroy()

    const knex = Knex(config)

    // migrations
    await knex.migrate.latest()

    // bind all Models to a knex instance.
    Model.knex(knex)
  } catch (error) {
    console.error('API failed setup database')
    console.error(error)
  }
}

export { isConnected, setupDatabase }
