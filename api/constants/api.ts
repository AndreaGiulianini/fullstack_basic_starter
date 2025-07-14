// Base URL Configuration
export const BASE_URL = process.env.BASE_URL || 'http://localhost'

// API Response Headers
export const RESPONSE_HEADERS = {
  CONTENT_TYPE: 'application/json',
  CACHE_CONTROL: 'no-cache'
} as const

// API Documentation
export const API_DOCS = {
  TITLE: 'Fastify API',
  DESCRIPTION: 'API documentation for Fastify project',
  VERSION: '1.0.0',
  SCHEMES: ['http'] as const,
  CONSUMES: 'application/json',
  PRODUCES: 'application/json',
  REFERENCE_ROUTE: '/reference',
  THEME: 'fastify'
} as const

// Security Definitions
export const SECURITY_DEFINITIONS = {
  BEARER_AUTH: {
    TYPE: 'apiKey',
    NAME: 'Authorization',
    IN: 'header',
    DESCRIPTION: 'Enter Bearer token **_only_**'
  }
} as const
