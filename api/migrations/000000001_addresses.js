const up = (knex) =>
  knex.schema.hasTable('addresses').then((exist) => {
    if (!exist) {
      console.log('Creating table addresses')
      return knex.schema.createTable('addresses', (table) => {
        table.increments('id').primary()
        table.string('street', 255).notNullable()
        // soft delete
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        table.timestamp('deleted_at').nullable().defaultTo(null)
      })
    }
    console.log('Creating table addresses (already exists)')
  })

const down = (knex) =>
  knex.schema.hasTable('addresses').then((exist) => {
    if (exist) {
      console.log('Dropping table addresses')
      return knex.schema.dropTable('addresses')
    }
    console.log('Dropping table addresses (doesnt exist).')
  })

export { up, down }
