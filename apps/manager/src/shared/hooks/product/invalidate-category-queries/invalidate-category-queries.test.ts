import { describe, expect, it, vi } from 'vitest'

import { invalidateCategoryQueries } from './invalidate-category-queries'
import { categoryInvalidationUnitIdMock } from './invalidate-category-queries.mock'

describe(invalidateCategoryQueries.name, () => {
  it('invalidates category and menu data together', () => {
    const queryClient = { invalidateQueries: vi.fn() }
    invalidateCategoryQueries(queryClient as never, categoryInvalidationUnitIdMock)
    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2)
  })
})
