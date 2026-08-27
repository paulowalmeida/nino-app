import { describe, expect, it } from 'vitest'

import { toCatalogViewStatus } from './catalog-view-status'

describe(toCatalogViewStatus.name, () => {
  it('returns idle when the query is disabled', () => {
    expect(toCatalogViewStatus(false, 'pending')).toBe('idle')
  })
  it('maps pending to loading when enabled', () => {
    expect(toCatalogViewStatus(true, 'pending')).toBe('loading')
  })
  it('preserves terminal query statuses', () => {
    expect(toCatalogViewStatus(true, 'success')).toBe('success')
    expect(toCatalogViewStatus(true, 'error')).toBe('error')
  })
})
