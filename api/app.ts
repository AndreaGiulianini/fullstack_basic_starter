import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import Fastify from 'fastify'
import errorHandlerPlugin from './middleware/errorHandler'
import betterAuthRoutes from './routes/betterAuth'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import { API_DOCS, SECURITY_DEFINITIONS, SERVER } from './utils/constants'
import { logShutdown, logStartup } from './utils/logger'

const app = Fastify({ logger: true })

app.register(errorHandlerPlugin)

app.register(swagger, {
  swagger: {
    info: {
      title: API_DOCS.TITLE,
      description: API_DOCS.DESCRIPTION,
      version: API_DOCS.VERSION
    },
    host: SERVER.LOCALHOST, // Update as needed for your environment
    schemes: [...API_DOCS.SCHEMES],
    consumes: [API_DOCS.CONSUMES],
    produces: [API_DOCS.PRODUCES],
    securityDefinitions: {
      bearerAuth: {
        type: SECURITY_DEFINITIONS.BEARER_AUTH.TYPE,
        name: SECURITY_DEFINITIONS.BEARER_AUTH.NAME,
        in: SECURITY_DEFINITIONS.BEARER_AUTH.IN,
        description: SECURITY_DEFINITIONS.BEARER_AUTH.DESCRIPTION
      }
    }
  }
})

app.register(scalar, {
  routePrefix: '/reference',
  configuration: {
    theme: 'fastify'
  }
})

app.register(testRoutes)
app.register(betterAuthRoutes)
app.register(userRoutes)

const start = async () => {
  try {
    await app.listen({ port: SERVER.PORT, host: SERVER.HOST })
    logStartup(SERVER.PORT, SERVER.HOST)
  } catch (err) {
    app.log.error(err)
    logShutdown('Error during startup')
    process.exit(1)
  }
}

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logShutdown('SIGTERM received')
  await app.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logShutdown('SIGINT received')
  await app.close()
  process.exit(0)
})

start()

export default app
