import { insertSeedsByEnv } from '../utils/misc.js'

const defaultData = [
  { id: 1, name: 'Jurassic Park' },
  { id: 2, name: 'Shining' },
  { id: 3, name: 'Titanic' },
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const seed = (knex) => {
  return knex('movies')
    .del()
    .then(() =>
      knex('movies').insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData }),
      ),
    )
}

export { seed }
