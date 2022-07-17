import cors from 'cors'
import express from 'express'
import promiseRouter from 'express-promise-router'

import registerApi from './routing.js'
import { isConnected, setupDatabase } from './utils/knexHandler.js'

;(async () => {
  const res = await isConnected()
  if (res) {
    await setupDatabase()
    const server = app.listen(5000, '0.0.0.0', () => {
      console.log('API listening at port %s', server.address().port)
    })
  }
})()

const app = express().use(cors()).use(express.json()).use(promiseRouter())

registerApi(app)
