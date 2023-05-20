import { insertSeedsByEnv } from '../utils/utils.js'

const defaultData = [
  { id: 1, name: 'Jurassic Park' },
  { id: 2, name: 'Shining' },
  { id: 3, name: 'Titanic' },
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const tableName = 'movies'
const seed = (knex) => {
  return knex(tableName)
    .del()
    .then(() =>
      knex(tableName).insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData }),
      ),
    )
}

export { seed }
