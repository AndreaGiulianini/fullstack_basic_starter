import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import authRoutes from './routes/authRoutes'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import jwtPlugin from './utils/jwtPlugin'

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
    produces: ['application/json']
  }
})

// Register @fastify/swagger-ui to expose Swagger UI
app.register(swaggerUi, {
  routePrefix: '/swagger-ui', // Change this to your desired URL path
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: (_request, _reply, next) => {
      next()
    },
    preHandler: (_request, _reply, next) => {
      next()
    }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, _request, _reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true
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
