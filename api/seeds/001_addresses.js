import { insertSeedsByEnv } from '../utils/utils.js'

const defaultData = [
  { id: 1, street: 'Via Brusi' },
  { id: 2, street: 'Via Cavalcavia' },
  { id: 3, street: 'Via Garibaldi' }
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const tableName = 'addresses'
const seed = (knex) => {
  return knex(tableName)
    .del()
    .then(() =>
      knex(tableName).insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData })
      )
    )
}

export { seed }
