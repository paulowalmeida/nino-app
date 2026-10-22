import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { promotionService } from './promotion.service'
import {
  freeDeliveryPromotionMock,
  promotionUnitIdMock,
} from './promotion.service.mock'

vi.mock('@shared/services/http/http.service', () => ({ api: { get: vi.fn() } }))

describe('promotionService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listVisible: reads the campaigns the store shows on the menu', async () => {
    vi.mocked(api.get).mockResolvedValue([freeDeliveryPromotionMock])

    await expect(
      promotionService.listVisible(promotionUnitIdMock)
    ).resolves.toEqual([freeDeliveryPromotionMock])
    expect(api.get).toHaveBeenCalledWith(
      `units/${promotionUnitIdMock}/promotions/public`
    )
  })
})
