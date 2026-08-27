export type CatalogViewStatus = 'idle' | 'loading' | 'error' | 'success'

export const toCatalogViewStatus = (
  enabled: boolean,
  status: 'error' | 'pending' | 'success'
): CatalogViewStatus => {
  if (!enabled) return 'idle'
  if (status === 'pending') return 'loading'
  return status
}
