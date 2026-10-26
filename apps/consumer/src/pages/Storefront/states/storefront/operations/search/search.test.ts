import { describe, expect, it, vi } from 'vitest'
import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'
import { setHomeSearch } from './search'
import { homeSearchOperationMock } from './search.mock'

describe('setHomeSearch', () => {
  it('stores the current search query', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeSearch(set, homeSearchOperationMock.search)
    expect(set).toHaveBeenCalledWith({ search: homeSearchOperationMock.search })
  })
})
