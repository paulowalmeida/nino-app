export type Page<T> = {
  data: T[]
  pagination: { total: number }
}
