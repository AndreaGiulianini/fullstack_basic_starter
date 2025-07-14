// JWT Payload types
export interface JWTPayload {
  id: string
  email: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// JWT Function types
export type GenerateTokensFunction = (user: JWTPayload) => Promise<TokenPair>
export type VerifyRefreshTokenFunction = (refreshToken: string) => Promise<JWTPayload>
export type RevokeRefreshTokenFunction = (userId: string) => Promise<void>

// Authentication types
export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// Response types
export interface AuthSuccessResponse {
  success: true
  accessToken: string
  refreshToken: string
}

export interface ProfileResponse {
  success: true
  user: AuthenticatedUser
}

// Request types with user context
export interface AuthenticatedRequest {
  user: JWTPayload
}
