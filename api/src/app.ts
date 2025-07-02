import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import Fastify from 'fastify'
import { API_DOCS, ERROR_MESSAGES, SECURITY_DEFINITIONS, SERVER } from './constants'
import errorHandlerPlugin from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import jwtPlugin from './utils/jwt'

const app = Fastify({ logger: true })

app.register(errorHandlerPlugin)

app.register(jwtPlugin)

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
  routePrefix: API_DOCS.REFERENCE_ROUTE,
  configuration: {
    theme: API_DOCS.THEME
  }
})

app.register(testRoutes)
app.register(authRoutes)
app.register(userRoutes)

const startServer = async () => {
  try {
    await app.listen({ port: SERVER.PORT, host: SERVER.HOST })
    console.log(ERROR_MESSAGES.SERVER_RUNNING)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startServer()

export default app
