import type { SQL } from 'drizzle-orm'
import { count, eq } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import { AppError } from '../../utils/appError'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../utils/constants'
import type { DatabaseInstance } from '../types'

// =============================================================================
// GENERIC BASE REPOSITORY
// Provides common CRUD operations for all repositories
// =============================================================================

export abstract class BaseRepository<TEntity, TCreateData, TUpdateData> {
  protected constructor(
    protected db: DatabaseInstance,
    protected table: PgTable,
    protected entityName: string,
    protected idColumn: PgColumn // More specific type instead of any
  ) {}

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<TEntity | undefined> {
    this.validateId(id)

    const [record] = await this.db.select().from(this.table).where(eq(this.idColumn, id)).limit(1)

    return record as TEntity | undefined
  }

  /**
   * Find all entities with pagination
   */
  async findAll(options: { limit?: number; offset?: number; where?: SQL; orderBy?: SQL } = {}): Promise<TEntity[]> {
    const { limit = 10, offset = 0, where, orderBy } = options

    let query = this.db.select().from(this.table)

    if (where) {
      // biome-ignore lint/suspicious/noExplicitAny: Drizzle ORM query builder requires any for dynamic where clauses
      query = query.where(where) as any
    }

    if (orderBy) {
      // biome-ignore lint/suspicious/noExplicitAny: Drizzle ORM query builder requires any for dynamic orderBy clauses
      query = query.orderBy(orderBy) as any
    }

    const records = await query.limit(limit).offset(offset)

    return records as TEntity[]
  }

  /**
   * Count entities
   */
  async count(where?: SQL): Promise<number> {
    let query = this.db.select({ count: count() }).from(this.table)

    if (where) {
      // biome-ignore lint/suspicious/noExplicitAny: Drizzle ORM query builder requires any for dynamic where clauses
      query = query.where(where) as any
    }

    const [result] = await query
    return result?.count || 0
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<boolean> {
    this.validateId(id)

    const result = await this.db.delete(this.table).where(eq(this.idColumn, id))

    return result.rowCount !== null && result.rowCount > 0
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    this.validateId(id)

    const [record] = await this.db.select({ id: this.idColumn }).from(this.table).where(eq(this.idColumn, id)).limit(1)

    return !!record
  }

  /**
   * Find entities with custom condition
   */
  async findWhere(condition: SQL, limit = 10): Promise<TEntity[]> {
    const records = await this.db.select().from(this.table).where(condition).limit(limit)

    return records as TEntity[]
  }

  /**
   * Find first entity matching condition
   */
  async findFirst(condition: SQL): Promise<TEntity | undefined> {
    const [record] = await this.db.select().from(this.table).where(condition).limit(1)

    return record as TEntity | undefined
  }

  // =============================================================================
  // ABSTRACT METHODS
  // Must be implemented by concrete repositories
  // =============================================================================

  abstract create(data: TCreateData): Promise<TEntity>
  abstract update(id: string, data: Partial<TUpdateData>): Promise<TEntity>

  // =============================================================================
  // PROTECTED HELPER METHODS
  // =============================================================================

  protected validateId(id: string): void {
    const trimmedId = id?.trim()
    if (!trimmedId) {
      throw new AppError(`Invalid ${this.entityName} ID`, HTTP_STATUS.BAD_REQUEST)
    }
  }

  protected async ensureExists(id: string): Promise<void> {
    const exists = await this.exists(id)
    if (!exists) {
      throw new AppError(`${this.entityName} not found`, HTTP_STATUS.NOT_FOUND)
    }
  }

  protected handleDatabaseError(error: unknown, operation: string): never {
    console.error(`Database error in ${this.entityName} ${operation}:`, error)
    throw new AppError(ERROR_MESSAGES.DATABASE_OPERATION_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}
