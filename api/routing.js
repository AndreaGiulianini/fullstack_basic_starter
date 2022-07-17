import { _checkToken, _login } from './controllers/auth.js'
import _ping from './controllers/healthcheck.js'
import { _users, _usersWithGraph } from './controllers/pagination.js'
import { _transaction } from './controllers/transaction.js'

export default (router) => {
  router.get('/healthcheck/ping', _ping)

  router.get('/demo-transaction', _transaction)

  router.get('/demo-pagination/users', _users)
  router.get('/demo-pagination/users-with-graphs', _usersWithGraph)

  router.post('/login', _login)
  router.post('/check-token', _checkToken)
}
