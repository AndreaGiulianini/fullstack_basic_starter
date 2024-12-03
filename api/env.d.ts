declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: string
      DB_HOST: string
      DB_USER: string
      DB_PASS: string
      DB_NAME: string
      DB_PORT: number
      VALKEY_HOST: string
      VALKEY_PASS: string
      VALKEY_PORT: number
      ELASTICSEARCH_HOST: string
      ELASTICSEARCH_PORT: number
    }
  }
}

export {}
