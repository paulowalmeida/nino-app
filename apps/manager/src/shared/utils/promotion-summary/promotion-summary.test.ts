import { describe, expect, it } from 'vitest'

import { promotionSummaryParts } from './promotion-summary'
import {
  freeDeliverySummaryMock,
  summaryNowMock,
} from './promotion-summary.mock'

describe(promotionSummaryParts.name, () => {
  it('states the benefit and an end within the week by weekday', () => {
    expect(
      promotionSummaryParts(freeDeliverySummaryMock, summaryNowMock)
    ).toEqual({
      headline: 'Frete grátis acima de R$\u00a060,00',
      schedule: null,
      zones: null,
      period: 'até domingo',
    })
  })

  it('names any order when there is no minimum and dates a far end', () => {
    const parts = promotionSummaryParts(
      {
        ...freeDeliverySummaryMock,
        minOrderValue: 0,
        endsAt: '2026-11-30T23:00:00.000Z',
      },
      summaryNowMock
    )

    expect(parts.headline).toBe('Frete grátis em qualquer pedido')
    expect(parts.period).toBe('até 30/11')
  })

  it('compresses a run of days and formats the daily window', () => {
    const parts = promotionSummaryParts(
      {
        ...freeDeliverySummaryMock,
        weekdays: [4, 2, 3],
        dailyStartTime: '18:00',
        dailyEndTime: '23:30',
      },
      summaryNowMock
    )

    expect(parts.schedule).toBe('ter a qui, 18h–23h30')
  })

  it('lists scattered days and counts the chosen zones', () => {
    const parts = promotionSummaryParts(
      {
        ...freeDeliverySummaryMock,
        weekdays: [1, 5],
        allDeliveryZones: false,
        deliveryZoneIds: ['zone-1', 'zone-2'],
      },
      summaryNowMock
    )

    expect(parts.schedule).toBe('seg e sex')
    expect(parts.zones).toBe('2 zonas')
  })

  it('announces a scheduled start and omits a missing end', () => {
    expect(
      promotionSummaryParts(
        { ...freeDeliverySummaryMock, startsAt: '2026-10-30T03:00:00.000Z' },
        summaryNowMock
      ).period
    ).toBe('a partir de 30/10')
    expect(
      promotionSummaryParts(
        { ...freeDeliverySummaryMock, endsAt: null },
        summaryNowMock
      ).period
    ).toBeNull()
  })

  it('names percentage and fixed discounts, with the cap when there is one', () => {
    expect(
      promotionSummaryParts(
        {
          ...freeDeliverySummaryMock,
          type: 'PERCENTAGE_DISCOUNT',
          value: 10,
          maxDiscount: 15,
          minOrderValue: 50,
        },
        summaryNowMock
      ).headline
    ).toBe('10% de desconto (até R$\u00a015,00) acima de R$\u00a050,00')
    expect(
      promotionSummaryParts(
        {
          ...freeDeliverySummaryMock,
          type: 'FIXED_DISCOUNT',
          value: 10,
          minOrderValue: 0,
        },
        summaryNowMock
      ).headline
    ).toBe('R$\u00a010,00 de desconto em qualquer pedido')
  })

  it('names the gift product', () => {
    expect(
      promotionSummaryParts(
        {
          ...freeDeliverySummaryMock,
          type: 'GIFT',
          giftProduct: { name: 'Coca-Cola Lata' },
        },
        summaryNowMock
      ).headline
    ).toBe('Ganhe Coca-Cola Lata acima de R$\u00a060,00')
  })
})
