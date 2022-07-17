const successResponse = async ({ data, res, trx }) => {
  if (trx) {
    trx.commit()
  }
  return res.json({
    success: true,
    data,
  })
}

const errorResponse = async ({ statusCode = 200, err, res, trx }) => {
  if (trx) {
    trx.rollback()
  }

  console.log(err)
  return res.status(statusCode).json({
    success: false,
    err,
  })
}

export { successResponse, errorResponse }
