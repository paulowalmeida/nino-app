import { describe, expect, it, vi } from 'vitest'
import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'
import { setHomeSearch, setHomeSearchOpen } from './search'
import { homeSearchOperationMock } from './search.mock'

describe('setHomeSearch', () => {
  it('stores the current search query', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeSearch(set, homeSearchOperationMock.search)
    expect(set).toHaveBeenCalledWith({ search: homeSearchOperationMock.search })
  })

  it('opens the search keeping the query', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeSearchOpen(set, true)
    expect(set).toHaveBeenCalledWith({ isSearchOpen: true })
  })

  it('clears the query when the search closes', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeSearchOpen(set, false)
    expect(set).toHaveBeenCalledWith({ isSearchOpen: false, search: '' })
  })
})
