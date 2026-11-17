import { describe, expect, it } from 'vitest'

import { couponConditions, couponSteps, couponValidity } from './coupon-detail'
import {
  couponDetailFreeDeliveryMock,
  couponDetailMock,
  couponDetailNowMock,
  couponDetailZonesMock,
} from './coupon-detail.mock'

describe(couponConditions.name, () => {
  it('lists every condition the promotion has, in the order the customer can act', () => {
    const conditions = couponConditions(couponDetailMock, couponDetailZonesMock)

    expect(conditions.map(({ key }) => key)).toEqual([
      'minimum',
      'product',
      'payment',
      'audience',
    ])
    expect(conditions[1].value).toBe('X-Tudo')
    expect(conditions[2].value).toBe('Em dinheiro, no Pix')
  })

  it('names the zones of free delivery with the fee the customer saves', () => {
    const [zones] = couponConditions(
      { ...couponDetailFreeDeliveryMock, minOrderValue: 0 },
      couponDetailZonesMock
    )

    expect(zones.key).toBe('zones')
    expect(zones.value).toMatch(/^De 1 a 2 km \(taxa de R\$\s5,00\)$/)
  })

  it('says free delivery covers the whole area when no zone is set', () => {
    const [zones] = couponConditions(
      {
        ...couponDetailFreeDeliveryMock,
        minOrderValue: 0,
        allDeliveryZones: true,
        deliveryZoneIds: [],
      },
      couponDetailZonesMock
    )

    expect(zones.value).toBe('Toda a área de entrega')
  })

  it('omits conditions the promotion does not have', () => {
    expect(
      couponConditions(
        {
          ...couponDetailMock,
          minOrderValue: 0,
          eligibleProductIds: null,
          eligibleProductName: null,
          paymentMethods: [],
          firstOrderOnly: false,
        },
        []
      )
    ).toEqual([])
  })
})

describe(couponSteps.name, () => {
  it('walks a discount coupon from the product to the total', () => {
    expect(couponSteps(couponDetailMock)).toEqual([
      'Adicione X-Tudo à sacola',
      'Na revisão do pedido, escolha o cupom ou digite XTUDO10',
      'O desconto aparece no total antes de pagar',
    ])
  })

  it('asks for the minimum when there is no eligible product', () => {
    expect(
      couponSteps({
        ...couponDetailMock,
        code: null,
        eligibleProductIds: null,
        eligibleProductName: null,
      })[0]
    ).toMatch(/^Monte uma sacola de pelo menos R\$\s25,00$/)
  })

  it('describes the automatic offers without a coupon step', () => {
    expect(couponSteps(couponDetailFreeDeliveryMock)[2]).toBe(
      'O frete sai zerado do total'
    )
    expect(
      couponSteps({
        ...couponDetailMock,
        type: 'GIFT',
        giftProduct: { id: 'g', name: 'Refri 350ml', price: 6 },
      })[1]
    ).toBe('Refri 350ml entra no pedido sozinho')
  })
})

describe(couponValidity.name, () => {
  it('gives the date and how long is left when the end is near', () => {
    expect(couponValidity(couponDetailMock, couponDetailNowMock)).toEqual({
      date: '31/12/2026',
      remaining: 'Faltam 11 dias',
    })
  })

  it('leaves the remaining time out when the end is far', () => {
    expect(
      couponValidity(
        couponDetailMock,
        new Date('2026-01-01T12:00:00.000Z')
      )?.remaining
    ).toBeNull()
  })

  it('has no validity for a promotion without end', () => {
    expect(
      couponValidity({ ...couponDetailMock, endsAt: null })
    ).toBeNull()
  })
})
