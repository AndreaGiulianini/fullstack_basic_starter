// Auth types
export type {
  AuthenticatedRequest,
  AuthenticatedUser,
  AuthSuccessResponse,
  GenerateTokensFunction,
  JWTPayload,
  LoginCredentials,
  ProfileResponse,
  RefreshTokenRequest,
  RevokeRefreshTokenFunction,
  TokenPair,
  VerifyRefreshTokenFunction
} from './auth'

// Common types
export type {
  ApiResponse,
  DatabaseConfig,
  EnvironmentConfig,
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
  UpdateUserData,
  UpdateUserFunction,
  User,
  UserQueryResult,
  UsersQueryResult
} from './database'

// Fastify types
export type {
  AuthenticatedFastifyRequest,
  AuthenticatedPreHandler,
  AuthenticatedRouteHandler,
  PreHandler,
  RouteHandler,
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
