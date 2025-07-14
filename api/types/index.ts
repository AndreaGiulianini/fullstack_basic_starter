// Auth types
export type {
  AuthenticatedUser,
  BetterAuthSession,
  ProfileResponse
} from './auth'

// Common types
export type {
  ApiResponse,
  DatabaseConfig,
  ErrorResponse,
  FileUploadOptions,
  PaginatedResponse,
  PaginationParams,
  QueryFilters,
  SuccessResponse,
  UploadedFile
} from './common'

// Database types
export type {
  CreateUserData,
  CreateUserFunction,
  DatabaseInstance,
  DeleteUserFunction,
  GetUserFunction,
  SafeUser,
  SafeUserApi,
  UpdateUserData,
  UpdateUserFunction,
  User,
  UserQueryResult,
  UsersQueryResult
} from './database'

// Fastify types
export type {
  AuthenticatedFastifyReply,
  AuthenticatedFastifyRequest,
  AuthenticatedPreHandler,
  PreHandler,
  RouteOptions,
  RouteSchema
} from './fastify'

// Validation types
export type {
  FastifyError,
  SchemaValidationDetails,
  ValidationDetails,
  ValidationErrorDetail,
  ZodValidationDetails
} from './validation'
