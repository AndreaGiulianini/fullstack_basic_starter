import { insertSeedsByEnv } from '../utils/utils.js'

const defaultData = [
  {
    user_id: 1,
    movie_id: 1,
    is_favorite: true,
  },
  {
    user_id: 1,
    movie_id: 2,
    is_favorite: false,
  },
  {
    user_id: 1,
    movie_id: 3,
    is_favorite: false,
  },
  {
    user_id: 2,
    movie_id: 1,
    is_favorite: false,
  },
  {
    user_id: 2,
    movie_id: 2,
    is_favorite: true,
  },
  {
    user_id: 2,
    movie_id: 3,
    is_favorite: false,
  },
  {
    user_id: 3,
    movie_id: 3,
    is_favorite: true,
  },
]

const productionData = []
const stagingData = []
const testingData = []
const developmentData = []

const tableName = 'users_movies'
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
