const up = (knex) =>
  knex.schema.hasTable('users').then((exist) => {
    if (!exist) {
      console.log('Creating table users')
      return knex.schema.createTable('users', (table) => {
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
        // soft delete
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        table.timestamp('deleted_at').nullable().defaultTo(null)
      })
    }
    console.log('Creating table users (already exists)')
  })

const down = (knex) =>
  knex.schema.hasTable('users').then((exist) => {
    if (exist) {
      console.log('Dropping table users')
      return knex.schema.dropTable('users')
    }
    console.log('Dropping table users (doesnt exist).')
  })

export { up, down }
