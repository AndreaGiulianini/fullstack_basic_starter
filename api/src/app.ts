import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import userRoutes from './routes/userRoutes'
import testRoutes from './routes/testRoutes'

const app = Fastify({ logger: true })

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
    docExpansion: 'none',
    deepLinking: false
  }
})

app.register(testRoutes)
app.register(userRoutes)

const startServer = async () => {
  try {
    await app.listen({ port: 5000, host: '0.0.0.0' })
    console.log('Server is running on http://localhost:5000')
    console.log('Swagger UI available at http://localhost:5000/api/docs')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startServer()

export default app
