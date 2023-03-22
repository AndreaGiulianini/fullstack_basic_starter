import { _checkToken, _login } from './controllers/auth.js'
import _ping from './controllers/healthcheck.js'
import { _users, _usersWithGraph } from './controllers/pagination.js'
import { _transaction } from './controllers/transaction.js'

export default (router) => {
  router.get('/api/healthcheck/ping', _ping)

  router.get('/api/demo-transaction', _transaction)

  router.get('/api/demo-pagination/users', _users)
  router.get('/api/demo-pagination/users-with-graphs', _usersWithGraph)

  router.post('/api/login', _login)
  router.post('/api/check-token', _checkToken)
}
