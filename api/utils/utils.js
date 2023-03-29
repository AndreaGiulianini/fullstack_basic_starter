import { dev_seeds } from '../config.js'

const byEnv = (alternatives) => alternatives[process.env.ENVIRONMENT]

const insertSeedsByEnv = ({ defaultData, developmentData, testingData, stagingData, productionData }) => {
  if (process.env.ENVIRONMENT === 'development' && dev_seeds.length !== 1) {
    throw new Error(
      'You have enabled an incorrect number of seeds in config.js. Please enable only one of: development, testing, staging.\n\nIf you need to hack some values, please do it by modifying the developmentData var\n\n$\n\n',
    )
  }
  return [
    ...defaultData,
    ...byEnv({
      development: [
        ...(dev_seeds.includes('development') ? developmentData : []),
        ...(dev_seeds.includes('testing') ? testingData : []),
        ...(dev_seeds.includes('staging') ? stagingData : []),
        ...(dev_seeds.includes('production') ? productionData : []),
      ],
      testing: testingData,
      staging: stagingData,
      production: productionData,
    }),
  ]
}

let operationCounter = 0
const nextOp = () => {
  operationCounter = operationCounter + 1
  return operationCounter
}

const logUpOperation = (operation) => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(`${nextOp()} - ${operation}`)
}
const logUpOperationSkipped = (operation, reason = 'default reason') => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(`${nextOp()} - SKIPPED (${reason}) => ${operation}`)
}
const logDownOperation = (operation) => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(`${nextOp()} - REVERTING - ${operation}`)
}
const logDownOperationSkipped = (operation, reason = 'default reason') => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(` ${nextOp()} - REVERTING - ${operation} => SKIPPED (${reason})`)
}

export { insertSeedsByEnv, logUpOperation, logDownOperation, logUpOperationSkipped, logDownOperationSkipped }
