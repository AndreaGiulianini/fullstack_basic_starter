import Valkey from 'iovalkey'
import { DB_LIMITS, DEFAULT_PORTS } from '../constants'

const valkey = new Valkey({
  port: Number.parseInt(process.env.VALKEY_PORT || DEFAULT_PORTS.VALKEY.toString()),
  host: process.env.VALKEY_HOST || 'localhost',
  password: process.env.VALKEY_PASS,
  db: DB_LIMITS.DEFAULT_DB_INDEX
})

export default valkey
