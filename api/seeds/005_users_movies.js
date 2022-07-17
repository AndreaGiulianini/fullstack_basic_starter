import { insertSeedsByEnv } from '../utils/misc.js'

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

const seed = (knex) => {
  return knex('users_movies')
    .del()
    .then(() =>
      knex('users_movies').insert(
        insertSeedsByEnv({ defaultData, developmentData, testingData, stagingData, productionData }),
      ),
    )
}

export { seed }
