import { describe, expect, it } from 'vitest'

import { promotionLabel } from './promotion-label'
import {
  labelNowMock,
  labelOfferMock,
  restrictedDiscountMock,
} from './promotion-label.mock'

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

  it('names the gift product', () => {
    expect(
      promotionLabel({
        ...labelOfferMock,
        type: 'GIFT',
        endsAt: null,
        giftProduct: { id: 'coke', name: 'Coca-Cola Lata', price: 6.5 },
      })
    ).toBe('Ganhe Coca-Cola Lata acima de R$\u00a060,00')
  })

  it('names the single product the discount applies to', () => {
    expect(
      promotionLabel({
        ...restrictedDiscountMock,
        eligibleProductIds: ['x-tudo'],
        eligibleProductName: 'X-Tudo',
      })
    ).toBe('R$\u00a010,00 de desconto no X-Tudo')
  })

  it('names the restriction instead of promising every order', () => {
    expect(
      promotionLabel({
        ...restrictedDiscountMock,
        eligibleProductIds: ['x', 'y'],
      })
    ).toBe('R$\u00a010,00 de desconto em itens selecionados')
    expect(
      promotionLabel({ ...restrictedDiscountMock, firstOrderOnly: true })
    ).toBe('R$\u00a010,00 de desconto no seu primeiro pedido')
    expect(
      promotionLabel({
        ...restrictedDiscountMock,
        allDeliveryZones: false,
        deliveryZoneIds: ['zone-1'],
      })
    ).toBe('R$\u00a010,00 de desconto em alguns bairros')
    expect(
      promotionLabel({ ...restrictedDiscountMock, paymentMethods: ['PIX'] })
    ).toBe('R$\u00a010,00 de desconto pagando no Pix')
    expect(
      promotionLabel({
        ...restrictedDiscountMock,
        paymentMethods: ['PIX', 'CASH'],
      })
    ).toBe('R$\u00a010,00 de desconto em formas de pagamento selecionadas')
    expect(
      promotionLabel({ ...restrictedDiscountMock, paymentMethods: ['BOLETO'] })
    ).toBe('R$\u00a010,00 de desconto em formas de pagamento selecionadas')
  })

  it('keeps the minimum order next to the restriction', () => {
    expect(
      promotionLabel({
        ...restrictedDiscountMock,
        minOrderValue: 30,
        eligibleProductIds: ['x', 'y'],
      })
    ).toBe(
      'R$\u00a010,00 de desconto em itens selecionados acima de R$\u00a030,00'
    )
  })

  it('reads as every order when nothing restricts it', () => {
    expect(
      promotionLabel({
        ...restrictedDiscountMock,
        eligibleProductIds: [],
        paymentMethods: [],
      })
    ).toBe('R$\u00a010,00 de desconto em qualquer pedido')
  })
})
