export interface PaginationMeta {
  page: number
  size: number
  total: number
  totalPages: number
  previousPage: number | null
  nextPage: number | null
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface PaginatedQuery {
  page?: number
  size?: number
  target?: string
  direction?: 'asc' | 'desc'
}
