import { Model, raw } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'

const softDelete = objectionSoftDelete.default({
  columnName: 'deleted_at',
  deletedValue: raw('CURRENT_TIMESTAMP'),
  notDeletedValue: null,
})

class Identitydocuments extends softDelete(Model) {
  static get tableName() {
    return 'identity_documents'
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
        user_id: { type: 'integer' },
      },
      required: ['name', 'user_id'],
    }
  }

  static get relationMappings() {
    const Users = require('./users')

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'identity_documents.user_id',
          to: 'users.id',
        },
        filter: (f) => {
          f.whereNotDeleted()
        },
      },
    }
  }
}

export default Identitydocuments
