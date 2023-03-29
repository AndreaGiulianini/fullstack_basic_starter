import { logDownOperation, logDownOperationSkipped, logUpOperation, logUpOperationSkipped } from '../utils/utils.js'

const operation = 'Creating table identity_documents'

const up = async (knex) => {
  const exist = await knex.schema.hasTable('identity_documents')
  if (!exist) {
    logUpOperation(operation)
    await knex.schema.createTable('identity_documents', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')

      table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  } else {
    logUpOperationSkipped(operation, 'table already exists')
  }
}

const down = async (knex) => {
  const exist = await knex.schema.hasTable('identity_documents')
  if (exist) {
    logDownOperation(operation)
    await knex.schema.dropTable('identity_documents')
  } else {
    logDownOperationSkipped(operation, 'table doesnt exist')
  }
}

export { up, down }
