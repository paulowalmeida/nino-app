import { describe, expect, it } from 'vitest'

import { couponBlocker, couponBlockerReason } from './coupon-blocker'
import { couponBlockerMock } from './coupon-blocker.mock'

describe(couponBlocker.name, () => {
  it('blocks on the product first, even when the minimum is also missing', () => {
    expect(
      couponBlocker(
        {
          ...couponBlockerMock,
          eligibleProductIds: ['x-tudo'],
          eligibleProductName: 'X-Tudo',
        },
        { subtotal: 20, eligibleSubtotal: 0 }
      )
    ).toEqual({ kind: 'product', productName: 'X-Tudo' })
  })

  it('blocks on a payment method the coupon does not accept', () => {
    expect(
      couponBlocker(
        { ...couponBlockerMock, paymentMethods: ['PIX'] },
        { subtotal: 60, paymentMethod: 'CASH' }
      )
    ).toEqual({ kind: 'payment' })
  })

  it('says how much is missing and how far along the order is', () => {
    expect(couponBlocker(couponBlockerMock, { subtotal: 49.9 })).toEqual({
      kind: 'minimum',
      missing: 0.1,
      progress: 100,
    })
    expect(couponBlocker(couponBlockerMock, { subtotal: 25 })).toEqual({
      kind: 'minimum',
      missing: 25,
      progress: 50,
    })
  })

  it('does not block a coupon that already applies', () => {
    expect(couponBlocker(couponBlockerMock, { subtotal: 50 })).toBeNull()
  })

  it('leaves free delivery and gifts to their own rules', () => {
    expect(
      couponBlocker(
        { ...couponBlockerMock, type: 'FREE_DELIVERY' },
        { subtotal: 1 }
      )
    ).toBeNull()
  })

  it('explains each blocker in plain words', () => {
    expect(couponBlockerReason({ kind: 'minimum', missing: 10, progress: 50 }))
      .toMatch(/^Faltam R\$\s10,00 para usar$/)
    expect(couponBlockerReason({ kind: 'product', productName: 'X-Tudo' })).toBe(
      'Vale só no X-Tudo'
    )
    expect(couponBlockerReason({ kind: 'product', productName: null })).toBe(
      'Vale só em itens selecionados'
    )
    expect(couponBlockerReason({ kind: 'payment' })).toBe(
      'Vale só com outra forma de pagamento'
    )
  })
})
