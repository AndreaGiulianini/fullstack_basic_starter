import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import Fastify from 'fastify'
import authRoutes from './routes/authRoutes'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import jwtPlugin from './utils/jwt'

const app = Fastify({ logger: true })

app.register(jwtPlugin)

app.register(swagger, {
  swagger: {
    info: {
      title: 'Fastify API',
      description: 'API documentation for Fastify project',
      version: '1.0.0'
    },
    host: 'localhost', // Update as needed for your environment
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter JWT Bearer token **_only_**'
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
app.register(authRoutes)
app.register(userRoutes)

const startServer = async () => {
  try {
    await app.listen({ port: 5000, host: '0.0.0.0' })
    console.log('Server is running')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startServer()

export default app
