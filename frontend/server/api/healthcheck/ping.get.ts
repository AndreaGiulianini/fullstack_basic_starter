export default defineEventHandler(async (_event) => {
  try {
    // Only server side can fetch the API calling directly dockerized services
    const response = await fetch('http://api:5000/api/healthcheck/ping')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching API healthcheck:', error)
    return {
      status: 'error',
      message: 'Failed to connect to API',
      timestamp: new Date().toISOString()
    }
  }
})
