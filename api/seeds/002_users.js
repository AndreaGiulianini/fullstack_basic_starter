import { insertSeedsByEnv } from '../utils/misc.js'

const defaultData = [
  {
    id: 1,
    name: 'Demo name',
    surname: 'Demo surname',
    pwd_hash: '****',
    address_id: 1,
    birth_date: '1970-11-03',
    notes: null,
    enabled: true,
    money: 12.5,
    custom_field: 'asd',
  },
  {
    id: 2,
    name: 'Demo name',
    surname: 'Demo surname',
    pwd_hash: '****',
    address_id: 2,
    birth_date: '1970-11-03',
    notes: 'notes',
    enabled: true,
    money: 12.5,
    custom_field: 'asd',
  },
  {
    id: 3,
    name: 'Demo name',
    surname: 'Demo surname',
    pwd_hash: '****',
    address_id: 3,
    birth_date: '1970-11-03',
    notes: 'another note',
    enabled: true,
    money: 12.75,
    custom_field: null,
  },
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const seed = (knex) => {
  return knex('users')
    .del()
    .then(() =>
      knex('users').insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData }),
      ),
    )
}

export { seed }
