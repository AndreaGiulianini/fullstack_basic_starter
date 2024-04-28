import dayjs from 'dayjs'
import jwt from 'jwt-simple'

import { jwt_secret } from '../config.js'
import { errorResponse, successResponse } from '../utils/responseHelper.js'

const _login = async (req, res) => {
  try {
    const payload = {
      email: req.body.email,
      exp: dayjs().add(2, 'hours').unix(), // expiration date of the token
      iat: dayjs().unix() // the time the token is generated
    }
    const token = jwt.encode(payload, jwt_secret)
    return successResponse({ data: token, res })
  } catch (err) {
    return errorResponse({ err, res })
  }
}

const _checkToken = async (req, res) => {
  try {
    jwt.decode(req.headers.authorization.slice(7), jwt_secret)
    return successResponse({ data: 'ok', res })
  } catch (err) {
    return errorResponse({ statusCode: 500, err, res })
  }
}

export { _login, _checkToken }
