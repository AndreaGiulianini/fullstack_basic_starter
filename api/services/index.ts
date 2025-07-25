// =============================================================================
// SERVICES INDEX - DIRECT ACCESS PATTERN
// Centralized exports for all service functionality
// Simple, direct, and performant services without repository abstraction
// =============================================================================

// Session service functions
export {
  createSession,
  deleteSession,
  deleteSessionsByUserId,
  findAllSessions,
  findSessionById,
  findSessionsByUserId,
  sessionExists,
  updateSession
} from './sessionService'
// User service functions
export {
  createUser,
  deleteUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUser,
  userExists
} from './userService'
