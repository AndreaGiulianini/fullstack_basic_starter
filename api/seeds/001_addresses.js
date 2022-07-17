import { insertSeedsByEnv } from '../utils/misc.js'

const defaultData = [
  { id: 1, street: 'Via Brusi' },
  { id: 2, street: 'Via Cavalcavia' },
  { id: 3, street: 'Via Garibaldi' },
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const seed = (knex) => {
  return knex('addresses')
    .del()
    .then(() =>
      knex('addresses').insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData }),
      ),
    )
}

export { seed }
