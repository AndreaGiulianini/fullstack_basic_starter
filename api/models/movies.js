import { Model, raw } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'

import Users from './users.js'

const softDelete = objectionSoftDelete.default({
  columnName: 'deleted_at',
  deletedValue: raw('CURRENT_TIMESTAMP'),
  notDeletedValue: null,
})

class Movies extends softDelete(Model) {
  static get tableName() {
    return 'movies'
  }

  static get idColumn() {
    return 'id'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
      required: ['name'],
    }
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: 'movies.id',
          through: {
            from: 'users_movies.movie_id',
            to: 'users_movies.user_id',
          },
          to: 'users.id',
        },
        filter: (f) => {
          f.whereNotDeleted()
        },
      },
    }
  }
}

export default Movies
