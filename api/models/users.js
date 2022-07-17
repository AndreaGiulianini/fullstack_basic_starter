import { Model, raw } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'

import Addresses from './addresses.js'
import Identitydocuments from './identityDocuments.js'
import Movies from './movies.js'

const softDelete = objectionSoftDelete.default({
  columnName: 'deleted_at',
  deletedValue: raw('CURRENT_TIMESTAMP'),
  notDeletedValue: null,
})

class Users extends softDelete(Model) {
  static get tableName() {
    return 'users'
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
        surname: { type: 'string', minLength: 1, maxLength: 255 },
        pwd_hash: { type: 'string', minLength: 1, maxLength: 255 },
        address_id: { type: 'integer', minLength: 0, maxLength: 255 },
        birth_date: { type: 'string' },
        notes: { type: 'string', maxLength: 2000 },
        enabled: { type: 'boolean' },
        money: { type: 'number' },
        custom_field: { type: 'string', minLength: 0, maxLength: 255 },
      },
      required: ['name', 'surname', 'pwd_hash', 'address_id', 'enabled'],
    }
  }

  static get relationMappings() {
    return {
      address: {
        relation: Model.BelongsToOneRelation,
        modelClass: Addresses,
        join: {
          from: 'users.address_id',
          to: 'addresses.id',
        },
        filter: (f) => {
          f.whereNotDeleted()
        },
      },
      identity_document: {
        relation: Model.HasOneRelation,
        modelClass: Identitydocuments,
        join: {
          from: 'users.id',
          to: 'identity_documents.user_id',
        },
        filter: (f) => {
          f.whereNotDeleted().first()
        },
      },
      other_movies: {
        relation: Model.ManyToManyRelation,
        modelClass: Movies,
        join: {
          from: 'users.id',
          through: {
            from: 'users_movies.user_id',
            to: 'users_movies.movie_id',
            extra: ['is_favorite'],
          },
          to: 'movies.id',
        },
        filter: (f) => {
          f.whereNotDeleted() /*.where({ is_favorite: false })*/
        },
      },
      favorite_movie: {
        relation: Model.HasOneThroughRelation,
        modelClass: Movies,
        join: {
          from: 'users.id',
          through: {
            from: 'users_movies.user_id',
            to: 'users_movies.movie_id',
            extra: ['is_favorite'],
          },
          to: 'movies.id',
        },
        filter: (f) => {
          f.whereNotDeleted().where({ is_favorite: true }).first()
        },
      },
    }
  }

  static get modifiers() {
    const { ref } = Users

    return {
      ...super.modifiers,
      fullData(query) {
        query
          .select(
            ref('id'),
            ref('name'),
            ref('surname'),
            ref('address_id'),
            ref('birth_date'),
            ref('notes'),
            ref('enabled'),
            ref('money'),
            ref('custom_field'),
          )
          .withGraphFetched('[address, identity_document]')
      },
    }
  }
}

export default Users
