const knex_config = {
  // Fill only the fields related to the current environment
  development: {
    host: 'mysql',
    user: 'root',
    password: 'demo1234',
  },
  testing: {
    host: null,
    port: null,
    user: null,
    password: null,
  },
  staging: {
    host: null,
    port: null,
    user: null,
    password: null,
  },
  production: {
    host: null,
    port: null,
    user: null,
    password: null,
  },
}
const dev_seeds = [
  'development',
  // 'testing',
  // 'staging',
  // 'production',
]

const jwt_secret = 'zxcsdfertyuijkl,.-'

export { knex_config, dev_seeds, jwt_secret }
