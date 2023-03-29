import { logDownOperation, logDownOperationSkipped, logUpOperation, logUpOperationSkipped } from '../utils/utils.js'

const operation = 'Creating table users'

const up = async (knex) => {
  const exist = await knex.schema.hasTable('users')
  if (!exist) {
    logUpOperation(operation)
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('surname', 255).notNullable()
      table.string('pwd_hash', 255).notNullable()
      table.integer('address_id').unsigned().notNullable()
      table.foreign('address_id').references('addresses.id').onUpdate('CASCADE')
      table.datetime('birth_date').nullable().defaultTo(null)
      table.string('notes').nullable().defaultTo(null)
      table.boolean('enabled').notNullable().defaultTo(false)
      table.decimal('money', 12, 2).nullable().defaultTo(0)
      table.string('custom_field', 255).nullable()

      table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  } else {
    logUpOperationSkipped(operation, 'table already exists')
  }
}

const down = async (knex) => {
  const exist = await knex.schema.hasTable('users')
  if (exist) {
    logDownOperation(operation)
    await knex.schema.dropTable('users')
  } else {
    logDownOperationSkipped(operation, 'table doesnt exist')
  }
}

export { up, down }
