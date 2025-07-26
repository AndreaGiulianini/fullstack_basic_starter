// =============================================================================
// SERVICES INDEX - DIRECT ACCESS PATTERN
// Centralized exports for all service functionality
// Simple, direct, and performant services without repository abstraction
// =============================================================================

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
