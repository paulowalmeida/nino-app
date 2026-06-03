import { PaginationMeta } from './pagination-meta'

export type PaginatedResponse<T> = {
  data: T[]
  pagination: PaginationMeta
}
