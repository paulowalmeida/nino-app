import { describe, expect, it } from 'vitest'

import {
  toPromotionFormValues,
  toPromotionInput,
} from './promotionForm.adapter'
import {
  filledFormMock,
  formNowMock,
  pastCampaignMock,
} from './promotionForm.adapter.mock'

describe('promotionForm.adapter', () => {
  it('starts a new campaign now, for every zone, shown on the menu', () => {
    const values = toPromotionFormValues(undefined, 'create', formNowMock)

    expect(values).toMatchObject({
      startsAtDate: formNowMock,
      startsAtTime: '12:30',
      endsAtDate: undefined,
      zoneScope: 'all',
      showInMenu: true,
      perCustomer: 'unlimited',
    })
  })

  it('keeps every rule when editing', () => {
    const values = toPromotionFormValues(pastCampaignMock, 'edit', formNowMock)

    expect(values).toMatchObject({
      minOrderValue: '60,00',
      zoneScope: 'chosen',
      deliveryZoneIds: ['zone-1'],
      startsAtTime: '00:00',
      endsAtTime: '23:59',
      hasDailyWindow: true,
      code: 'FRETE',
      perCustomer: 'custom',
      perCustomerCount: 3,
      totalLimit: 50,
    })
  })

  it('duplicates the rules but restarts a period that already passed', () => {
    const values = toPromotionFormValues(
      pastCampaignMock,
      'duplicate',
      formNowMock
    )

    expect(values.startsAtDate).toEqual(formNowMock)
    expect(values.endsAtDate).toBeUndefined()
    expect(values.weekdays).toEqual([2, 4])
  })

  it('sends the API what the form says, named after the benefit', () => {
    const input = toPromotionInput(filledFormMock)

    expect(input).toMatchObject({
      name: 'Frete grátis acima de R$ 60,00',
      type: 'FREE_DELIVERY',
      code: 'frete',
      minOrderValue: 60,
      startsAt: new Date(2026, 9, 22, 18, 0).toISOString(),
      endsAt: new Date(2026, 9, 25, 23, 59).toISOString(),
      dailyStartTime: '18:00',
      dailyEndTime: '02:00',
      allDeliveryZones: false,
      deliveryZoneIds: ['zone-1'],
      showInMenu: false,
      perCustomerLimit: 1,
      totalLimit: 50,
    })
  })

  it('clears zones, window and limits that were switched off', () => {
    const input = toPromotionInput({
      ...filledFormMock,
      zoneScope: 'all',
      hasDailyWindow: false,
      perCustomer: 'unlimited',
      totalLimit: '',
      minOrderValue: '',
      endsAtDate: undefined,
    })

    expect(input).toMatchObject({
      allDeliveryZones: true,
      deliveryZoneIds: [],
      dailyStartTime: null,
      dailyEndTime: null,
      perCustomerLimit: null,
      totalLimit: null,
      minOrderValue: 0,
      endsAt: null,
    })
  })

  it('sends a capped percentage discount for every address', () => {
    const input = toPromotionInput({
      ...filledFormMock,
      campaignType: 'discount',
      discountKind: 'PERCENTAGE_DISCOUNT',
      discountValue: '12,5',
      maxDiscount: '15,00',
    })

    expect(input).toMatchObject({
      type: 'PERCENTAGE_DISCOUNT',
      value: 12.5,
      maxDiscount: 15,
      allDeliveryZones: true,
      deliveryZoneIds: [],
    })
  })

  it('drops the cap from a fixed discount and reloads it for editing', () => {
    const input = toPromotionInput({
      ...filledFormMock,
      campaignType: 'discount',
      discountKind: 'FIXED_DISCOUNT',
      discountValue: '10,00',
      maxDiscount: '15,00',
    })
    expect(input).toMatchObject({ type: 'FIXED_DISCOUNT', value: 10, maxDiscount: null })

    expect(
      toPromotionFormValues(
        { ...pastCampaignMock, type: 'PERCENTAGE_DISCOUNT', value: 10, maxDiscount: 15 },
        'edit',
        formNowMock
      )
    ).toMatchObject({
      campaignType: 'discount',
      discountKind: 'PERCENTAGE_DISCOUNT',
      discountValue: '10',
      maxDiscount: '15,00',
    })
  })

  it('sends a gift with its product and no value', () => {
    expect(
      toPromotionInput({
        ...filledFormMock,
        campaignType: 'gift',
        giftProductId: 'coke',
      })
    ).toMatchObject({
      type: 'GIFT',
      value: 0,
      giftProductId: 'coke',
      allDeliveryZones: true,
    })
  })
})
