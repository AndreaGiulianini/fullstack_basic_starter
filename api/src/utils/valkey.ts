import Valkey from 'iovalkey'

const valkey = new Valkey({
  port: Number.parseInt(process.env.VALKEY_PORT || '5000'),
  host: process.env.VALKEY_HOST || 'localhost',
  password: process.env.VALKEY_PASS,
  db: 0 // Defaults to 0
})

export default valkey
