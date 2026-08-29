import { describe, expect, it } from 'vitest'
import { useCheckoutTotals } from './useCheckoutTotals'
import { useCheckoutTotalsMock } from './useCheckoutTotals.mock'
describe('useCheckoutTotals', () => {
  it('adds delivery only for delivery orders', () => {
    expect(
      useCheckoutTotals({
        cartLines: useCheckoutTotalsMock.cartLines as never,
        isDelivery: true,
        zone: { fee: useCheckoutTotalsMock.deliveryFee } as never,
        estimatedMinutes: useCheckoutTotalsMock.estimatedMinutes,
      })
    ).toMatchObject({ subtotal: 25, deliveryFee: 5, total: 30 })
  })
})
