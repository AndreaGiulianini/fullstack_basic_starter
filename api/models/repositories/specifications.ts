import type { SQL } from 'drizzle-orm'
import { and, asc, desc, eq, gte, isNull, like, lte, or } from 'drizzle-orm'
import { user } from '../schema'
import type { User } from '../types'

// =============================================================================
// SPECIFICATION PATTERN
// Encapsulates business rules and query logic in reusable objects
// =============================================================================

export abstract class Specification<T> {
  abstract toSql(): SQL<unknown>

  and(other: Specification<T>): AndSpecification<T> {
    return new AndSpecification(this, other)
  }

  or(other: Specification<T>): OrSpecification<T> {
    return new OrSpecification(this, other)
  }
}

// =============================================================================
// LOGICAL OPERATORS
// =============================================================================

export class AndSpecification<T> extends Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super()
  }

  toSql(): SQL<unknown> {
    const leftSql = this.left.toSql()
    const rightSql = this.right.toSql()
    return and(leftSql, rightSql) || leftSql
  }
}

export class OrSpecification<T> extends Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super()
  }

  toSql(): SQL<unknown> {
    const leftSql = this.left.toSql()
    const rightSql = this.right.toSql()
    return or(leftSql, rightSql) || leftSql
  }
}

// =============================================================================
// USER SPECIFICATIONS
// Business rules for user queries
// =============================================================================

export class UserByEmailSpecification extends Specification<User> {
  constructor(private email: string) {
    super()
  }

  toSql(): SQL<unknown> {
    return eq(user.email, this.email)
  }
}

export class UserByNamePatternSpecification extends Specification<User> {
  constructor(private namePattern: string) {
    super()
  }

  toSql(): SQL<unknown> {
    return like(user.name, `%${this.namePattern}%`)
  }
}

export class VerifiedUserSpecification extends Specification<User> {
  toSql(): SQL<unknown> {
    return eq(user.emailVerified, true)
  }
}

export class UserCreatedAfterSpecification extends Specification<User> {
  constructor(private date: Date) {
    super()
  }

  toSql(): SQL<unknown> {
    return gte(user.createdAt, this.date)
  }
}

export class UserCreatedBeforeSpecification extends Specification<User> {
  constructor(private date: Date) {
    super()
  }

  toSql(): SQL<unknown> {
    return lte(user.createdAt, this.date)
  }
}

export class UserWithoutImageSpecification extends Specification<User> {
  toSql(): SQL<unknown> {
    return isNull(user.image)
  }
}

// =============================================================================
// QUERY BUILDER
// Fluent interface for building complex queries
// =============================================================================

export class UserQueryBuilder {
  private specifications: Specification<User>[] = []
  private _limit?: number
  private _offset?: number
  private _orderBy?: SQL<unknown> | undefined

  // =============================================================================
  // FILTER METHODS
  // =============================================================================

  byEmail(email: string): this {
    this.specifications.push(new UserByEmailSpecification(email))
    return this
  }

  byNamePattern(pattern: string): this {
    this.specifications.push(new UserByNamePatternSpecification(pattern))
    return this
  }

  onlyVerified(): this {
    this.specifications.push(new VerifiedUserSpecification())
    return this
  }

  createdAfter(date: Date): this {
    this.specifications.push(new UserCreatedAfterSpecification(date))
    return this
  }

  createdBefore(date: Date): this {
    this.specifications.push(new UserCreatedBeforeSpecification(date))
    return this
  }

  createdBetween(startDate: Date, endDate: Date): this {
    this.specifications.push(
      new UserCreatedAfterSpecification(startDate).and(new UserCreatedBeforeSpecification(endDate))
    )
    return this
  }

  withoutImage(): this {
    this.specifications.push(new UserWithoutImageSpecification())
    return this
  }

  // =============================================================================
  // SORTING AND PAGINATION
  // =============================================================================

  orderByCreatedAt(direction: 'asc' | 'desc' = 'desc'): this {
    this._orderBy = direction === 'desc' ? desc(user.createdAt) : asc(user.createdAt)
    return this
  }

  orderByName(direction: 'asc' | 'desc' = 'asc'): this {
    this._orderBy = direction === 'desc' ? desc(user.name) : asc(user.name)
    return this
  }

  limit(limit: number): this {
    this._limit = limit
    return this
  }

  offset(offset: number): this {
    this._offset = offset
    return this
  }

  paginate(page: number, pageSize: number): this {
    this._limit = pageSize
    this._offset = (page - 1) * pageSize
    return this
  }

  // =============================================================================
  // BUILD METHODS
  // =============================================================================

  buildWhereClause(): SQL<unknown> | undefined {
    if (this.specifications.length === 0) {
      return undefined
    }

    if (this.specifications.length === 1) {
      return this.specifications[0].toSql()
    }

    // Combine all specifications with AND
    return this.specifications.slice(1).reduce((combined, spec) => {
      const specSql = spec.toSql()
      return and(combined, specSql) || combined
    }, this.specifications[0].toSql())
  }

  buildQuery() {
    return {
      where: this.buildWhereClause(),
      orderBy: this._orderBy,
      limit: this._limit,
      offset: this._offset
    }
  }

  // =============================================================================
  // PRESET QUERIES
  // Common business query combinations
  // =============================================================================

  static recentVerifiedUsers(days = 7, limit = 10): UserQueryBuilder {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return new UserQueryBuilder().onlyVerified().createdAfter(cutoffDate).orderByCreatedAt('desc').limit(limit)
  }

  static searchActiveUsers(searchTerm: string, limit = 10): UserQueryBuilder {
    return new UserQueryBuilder().onlyVerified().byNamePattern(searchTerm).orderByName('asc').limit(limit)
  }

  static usersDashboard(page = 1, pageSize = 20): UserQueryBuilder {
    return new UserQueryBuilder().orderByCreatedAt('desc').paginate(page, pageSize)
  }
}

// =============================================================================
// USAGE EXAMPLES (for documentation)
// =============================================================================

/*
// Simple specification usage:
const verifiedUsers = new VerifiedUserSpecification()
const recentUsers = new UserCreatedAfterSpecification(new Date('2024-01-01'))
const complexSpec = verifiedUsers.and(recentUsers)

// Query builder usage:
const queryBuilder = new UserQueryBuilder()
  .onlyVerified()
  .createdAfter(new Date('2024-01-01'))
  .byNamePattern('john')
  .orderByCreatedAt('desc')
  .limit(10)

const query = queryBuilder.buildQuery()

// Preset queries:
const recentVerified = UserQueryBuilder.recentVerifiedUsers(30, 20)
const searchResults = UserQueryBuilder.searchActiveUsers('john', 15)
*/
