const up = (knex) =>
  knex.schema.hasTable('users_movies').then((exist) => {
    if (!exist) {
      console.log('Creating table users_movies')
      return knex.schema.createTable('users_movies', (table) => {
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
        table.integer('movie_id').unsigned().notNullable()
        table.foreign('movie_id').references('movies.id').onDelete('CASCADE').onUpdate('CASCADE')
        table.boolean('is_favorite').notNullable().defaultTo(false)
      })
    }
    console.log('Creating table users_movies (already exists)')
  })

const down = (knex) =>
  knex.schema.hasTable('users_movies').then((exist) => {
    if (exist) {
      console.log('Dropping table users_movies')
      return knex.schema.dropTable('users_movies')
    }
    console.log('Dropping table users_movies (doesnt exist)')
  })

export { up, down }
