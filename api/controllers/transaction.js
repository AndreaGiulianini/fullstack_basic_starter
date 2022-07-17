import dayjs from 'dayjs'
import { Model } from 'objection'

import Addresses from '../models/addresses.js'
import Users from '../models/users.js'
import { errorResponse, successResponse } from '../utils/responseHelper.js'

const addAddress = async (trx) => {
  return await Addresses.query(trx).insert({
    street: 'Via dalle bombole',
  })
}

const addUser = async (trx, addressId) => {
  return await Users.query(trx).insert({
    name: 'Ezio',
    surname: 'Stimato',
    pwd_hash: 'akjshdkjahsdkjahsdk',
    address_id: addressId,
    birth_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    money: 0.0,
    enabled: true,
  })
}

const _transaction = async (req, res) => {
  let trx
  try {
    trx = await Model.startTransaction()
    const address = await addAddress(trx)
    console.log('add address:', address)
    console.log(address.id)
    const user = await addUser(trx, address.id)
    console.log('add user:', user)
    return successResponse({ data: user, res, trx })
  } catch (err) {
    return errorResponse({ err, res, trx })
  }
}

export { _transaction }
