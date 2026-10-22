import { describe, expect, it } from 'vitest'

import { promotionLimitsLabel } from './promotionLimitsLabel'
import { onceWithCapMock } from './promotionLimitsLabel.mock'

describe(promotionLimitsLabel.name, () => {
  it('joins the per-customer and total caps', () => {
    expect(promotionLimitsLabel(onceWithCapMock)).toBe(
      '1 vez por cliente · primeiros 50 pedidos'
    )
  })

  it('counts custom uses and says when nothing limits', () => {
    expect(
      promotionLimitsLabel({
        perCustomer: 'custom',
        perCustomerCount: 3,
        totalLimit: '',
      })
    ).toBe('3 vezes por cliente')
    expect(
      promotionLimitsLabel({
        perCustomer: 'unlimited',
        perCustomerCount: '',
        totalLimit: '',
      })
    ).toBe('Sem limite')
  })
})
