import { describe, expect, it, vi } from 'vitest'
import type { SetHomeInteractionState } from '@pages/Home/types/SetHomeInteractionState.type'
import { setHomeSearch } from './search'
import { homeSearchOperationMock } from './search.mock'

describe('setHomeSearch', () => {
  it('stores the current search query', () => {
    const set = vi.fn() as unknown as SetHomeInteractionState
    setHomeSearch(set, homeSearchOperationMock.search)
    expect(set).toHaveBeenCalledWith({ search: homeSearchOperationMock.search })
  })
})
