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

export { insertSeedsByEnv }
