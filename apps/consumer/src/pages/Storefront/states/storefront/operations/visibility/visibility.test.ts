import { describe, expect, it, vi } from 'vitest'
import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'
import { setHomeCartOpen, setHomeFocusedPromotion } from './visibility'
import { homeVisibilityOperationMock } from './visibility.mock'

describe('setHomeCartOpen', () => {
  it('stores the cart drawer visibility', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeCartOpen(set, homeVisibilityOperationMock.open)
    expect(set).toHaveBeenCalledWith({ isCartOpen: true })
  })
})

describe('setHomeFocusedPromotion', () => {
  it('stores which promotion the panel is focused on', () => {
    const set = vi.fn() as unknown as SetStorefrontInteractionState
    setHomeFocusedPromotion(set, homeVisibilityOperationMock.promotionId)
    expect(set).toHaveBeenCalledWith({ focusedPromotionId: 'promo-1' })
  })
})
