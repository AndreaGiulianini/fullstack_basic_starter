import { logDownOperation, logDownOperationSkipped, logUpOperation, logUpOperationSkipped } from '../utils/utils.js'

const operation = 'Creating table movies'

const up = async (knex) => {
  const exist = await knex.schema.hasTable('movies')
  if (!exist) {
    logUpOperation(operation)
    await knex.schema.createTable('movies', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  } else {
    logUpOperationSkipped(operation, 'table already exists')
  }
}

const down = async (knex) => {
  const exist = await knex.schema.hasTable('movies')
  if (exist) {
    logDownOperation(operation)
    await knex.schema.dropTable('movies')
  } else {
    logDownOperationSkipped(operation, 'table doesnt exist')
  }
}

export { up, down }
