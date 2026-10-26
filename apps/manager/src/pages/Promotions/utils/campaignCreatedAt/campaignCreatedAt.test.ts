import { describe, expect, it } from 'vitest'

import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { campaignCreatedAt } from './campaignCreatedAt'

describe(campaignCreatedAt.name, () => {
  it('shows the creation day with a two-digit year', () => {
    expect(campaignCreatedAt(promotionMock)).toBe('22/10/26')
  })
})
