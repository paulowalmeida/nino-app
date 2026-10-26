import { describe, expect, it, vi } from 'vitest'
import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'
import { setHomeCartOpen } from './visibility'
import { homeVisibilityOperationMock } from './visibility.mock'

describe('setHomeCartOpen', () => {
  it('stores the cart drawer visibility', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeCartOpen(set, homeVisibilityOperationMock.open)
    expect(set).toHaveBeenCalledWith({ isCartOpen: true })
  })
})
