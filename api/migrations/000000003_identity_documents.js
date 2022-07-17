const up = (knex) =>
  knex.schema.hasTable('identity_documents').then((exist) => {
    if (!exist) {
      console.log('Creating table identity_documents')
      return knex.schema.createTable('identity_documents', (table) => {
        table.increments('id').primary()
        table.string('name', 255).notNullable()
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
        // soft delete
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        table.timestamp('deleted_at').nullable().defaultTo(null)
      })
    }
    console.log('Creating table identity_documents (already exists)')
  })

const down = (knex) =>
  knex.schema.hasTable('identity_documents').then((exist) => {
    if (exist) {
      console.log('Dropping table identity_documents')
      return knex.schema.dropTable('identity_documents')
    }
    console.log('Dropping table identity_documents (doesnt exist).')
  })

export { up, down }
