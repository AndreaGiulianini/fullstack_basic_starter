import type { ZodSchema } from 'zod/v4'
import * as z from 'zod/v4'

// Type definition for JSON Schema objects
interface JsonSchemaObject {
  [key: string]: unknown
  $schema?: string
  $id?: string
  $defs?: Record<string, unknown>
  properties?: Record<string, unknown>
  items?: unknown
  additionalProperties?: unknown | boolean
  oneOf?: unknown[]
  anyOf?: unknown[]
  allOf?: unknown[]
}

/**
 * Converts zod schema to Fastify-compatible JSON schema
 * Removes draft 2020-12 references and makes it compatible with draft-07
 */
export function toFastifySchema<T>(schema: ZodSchema<T>): object {
  const jsonSchema = z.toJSONSchema(schema)

  // Remove the $schema property that references draft 2020-12
  const cleanSchema = { ...jsonSchema } as JsonSchemaObject
  delete cleanSchema.$schema

  // Convert any incompatible properties
  return convertToFastifyCompatible(cleanSchema) as object
}

/**
 * Recursively converts schema properties to be Fastify compatible
 */
function convertToFastifyCompatible(schema: unknown): unknown {
  if (typeof schema !== 'object' || schema === null) {
    return schema
  }

  if (Array.isArray(schema)) {
    return schema.map(convertToFastifyCompatible)
  }

  const schemaObj = schema as JsonSchemaObject
  const converted: JsonSchemaObject = { ...schemaObj }

  // Remove draft 2020-12 specific properties
  delete converted.$schema
  delete converted.$id
  delete converted.$defs

  // Convert properties recursively
  if (converted.properties && typeof converted.properties === 'object') {
    converted.properties = Object.fromEntries(
      Object.entries(converted.properties).map(([key, value]) => [key, convertToFastifyCompatible(value)])
    )
  }

  if (converted.items) {
    converted.items = convertToFastifyCompatible(converted.items)
  }

  if (converted.additionalProperties && typeof converted.additionalProperties === 'object') {
    converted.additionalProperties = convertToFastifyCompatible(converted.additionalProperties)
  }

  if (Array.isArray(converted.oneOf)) {
    converted.oneOf = converted.oneOf.map(convertToFastifyCompatible)
  }

  if (Array.isArray(converted.anyOf)) {
    converted.anyOf = converted.anyOf.map(convertToFastifyCompatible)
  }

  if (Array.isArray(converted.allOf)) {
    converted.allOf = converted.allOf.map(convertToFastifyCompatible)
  }

  return converted
}
