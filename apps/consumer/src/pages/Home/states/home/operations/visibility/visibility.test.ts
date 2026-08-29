import { describe, expect, it, vi } from 'vitest'
import type { SetHomeInteractionState } from '@pages/Home/types/SetHomeInteractionState.type'
import { setHomeCartOpen } from './visibility'
import { homeVisibilityOperationMock } from './visibility.mock'

describe('setHomeCartOpen', () => {
  it('stores the cart drawer visibility', () => {
    const set = vi.fn() as unknown as SetHomeInteractionState
    setHomeCartOpen(set, homeVisibilityOperationMock.open)
    expect(set).toHaveBeenCalledWith({ isCartOpen: true })
  })
})
