type Pagination = { page: number; total: number }

export const nextPageParam = (
  { page, total }: Pagination,
  pageSize: number
): number | undefined => {
  const loaded = page * pageSize
  return loaded < total ? page + 1 : undefined
}
