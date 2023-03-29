import { logDownOperation, logDownOperationSkipped, logUpOperation, logUpOperationSkipped } from '../utils/utils.js'

const operation = 'Creating table users_movies'

const up = async (knex) => {
  const exist = await knex.schema.hasTable('users_movies')
  if (!exist) {
    logUpOperation(operation)
    await knex.schema.createTable('users_movies', (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('movie_id').unsigned().notNullable()
      table.foreign('movie_id').references('movies.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.boolean('is_favorite').notNullable().defaultTo(false)
    })
  } else {
    logUpOperationSkipped(operation, 'table already exists')
  }
}

const down = async (knex) => {
  const exist = await knex.schema.hasTable('users_movies')
  if (exist) {
    logDownOperation(operation)
    await knex.schema.dropTable('users_movies')
  } else {
    logDownOperationSkipped(operation, 'table doesnt exist')
  }
}

export { up, down }
