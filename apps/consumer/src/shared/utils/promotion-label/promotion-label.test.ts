import { describe, expect, it } from 'vitest'

import { promotionLabel } from './promotion-label'
import { labelNowMock, labelOfferMock } from './promotion-label.mock'

describe(promotionLabel.name, () => {
  it('writes free delivery with the end of the campaign', () => {
    expect(promotionLabel(labelOfferMock, labelNowMock)).toBe(
      'Frete grátis acima de R$ 60,00 · até domingo'
    )
  })

  it('writes a capped percentage and a fixed discount', () => {
    expect(
      promotionLabel({
        ...labelOfferMock,
        type: 'PERCENTAGE_DISCOUNT',
        value: 10,
        maxDiscount: 15,
        endsAt: null,
      })
    ).toBe('10% de desconto (até R$ 15,00) acima de R$ 60,00')
    expect(
      promotionLabel({
        ...labelOfferMock,
        type: 'FIXED_DISCOUNT',
        value: 10,
        minOrderValue: 0,
        endsAt: null,
      })
    ).toBe('R$ 10,00 de desconto em qualquer pedido')
  })
})
