import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'

const streamToElastic = pinoElastic({
  index: 'info',
  node: `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
  opType: 'index',
  esVersion: 8,
  flushBytes: 1000
})

const level = 'trace'
const logger = pino(
  { level, ...ecsFormat },
  pino.multistream([
    { level, stream: streamToElastic },
    { level, stream: process.stdout }
  ])
)

// Capture errors like unable to connect Elasticsearch instance.
streamToElastic.on('error', (error) => {
  console.error('Elasticsearch client error:', error)
})
// Capture errors returned from Elasticsearch, "it will be called every time a document can't be indexed".
streamToElastic.on('insertError', (error) => {
  console.error('Elasticsearch server error:', error)
})

export default logger
