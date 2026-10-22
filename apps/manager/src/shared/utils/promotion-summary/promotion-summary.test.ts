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
})
