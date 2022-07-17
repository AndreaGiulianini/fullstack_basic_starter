import { Model, raw } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'

import Users from './users.js'

const softDelete = objectionSoftDelete.default({
  columnName: 'deleted_at',
  deletedValue: raw('CURRENT_TIMESTAMP'),
  notDeletedValue: null,
})

class Addresses extends softDelete(Model) {
  static get tableName() {
    return 'addresses'
  }

  static get idColumn() {
    return 'id'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        street: { type: 'string', minLength: 1, maxLength: 255 },
      },
      required: ['street'],
    }
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: Users,
        join: {
          from: 'addresses.id',
          to: 'users.address_id',
        },
        filter: (f) => {
          f.whereNotDeleted()
        },
      },
    }
  }
}
export default Addresses
