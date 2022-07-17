const up = (knex) =>
  knex.schema.hasTable('movies').then((exist) => {
    if (!exist) {
      console.log('Creating table movies')
      return knex.schema.createTable('movies', (table) => {
        table.increments('id').primary()
        table.string('name', 255).notNullable()
        // soft delete
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        table.timestamp('deleted_at').nullable().defaultTo(null)
      })
    }
    console.log('Creating table movies (already exists)')
  })

const down = (knex) =>
  knex.schema.hasTable('movies').then((exist) => {
    if (exist) {
      console.log('Dropping table movies')
      return knex.schema.dropTable('movies')
    }
    console.log('Dropping table movies (doesnt exist).')
  })

export { up, down }
