declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: string
      DB_HOST: string
      DB_USER: string
      DB_PASS: string
      DB_NAME: string
      DB_PORT: number
    }
  }
}
