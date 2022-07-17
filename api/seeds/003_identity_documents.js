import { insertSeedsByEnv } from '../utils/misc.js'

const defaultData = [
  {
    id: 1,
    name: 'Identity card',
    user_id: 1,
  },
  {
    id: 2,
    name: 'Fiscal code',
    user_id: 2,
  },
  {
    id: 3,
    name: 'Driver license',
    user_id: 3,
  },
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const seed = (knex) => {
  return knex('identity_documents')
    .del()
    .then(() =>
      knex('identity_documents').insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData }),
      ),
    )
}

export { seed }
