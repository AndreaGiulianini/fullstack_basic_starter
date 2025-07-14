// Better-Auth Session types
export interface BetterAuthSession {
  user: {
    id: string
    email: string
    name: string | null
  }
  session: {
    id: string
    expiresAt: Date
  }
}

// Authentication types
export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
}

// Profile response type
export interface ProfileResponse {
  success: true
  user: AuthenticatedUser
}
