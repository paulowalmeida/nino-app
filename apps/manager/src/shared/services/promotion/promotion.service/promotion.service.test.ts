import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { PromotionService } from './promotion.service'
import {
  promotionIdMock,
  promotionInputMock,
  promotionMock,
  promotionUnitIdMock,
} from './promotion.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), create: vi.fn(), patch: vi.fn() },
}))

const campaignPath = `units/${promotionUnitIdMock}/promotions/${promotionIdMock}`

describe('PromotionService', () => {
  afterEach(() => vi.clearAllMocks())

  it('list: reads the unit campaigns', async () => {
    vi.mocked(api.get).mockResolvedValue([promotionMock])

    await expect(PromotionService.list(promotionUnitIdMock)).resolves.toEqual([
      promotionMock,
    ])
    expect(api.get).toHaveBeenCalledWith(`units/${promotionUnitIdMock}/promotions`)
  })

  it('create and update: send the campaign form', async () => {
    vi.mocked(api.create).mockResolvedValue(promotionMock)
    vi.mocked(api.patch).mockResolvedValue(promotionMock)

    await PromotionService.create(promotionUnitIdMock, promotionInputMock)
    await PromotionService.update(
      promotionUnitIdMock,
      promotionIdMock,
      promotionInputMock
    )

    expect(api.create).toHaveBeenCalledWith(
      `units/${promotionUnitIdMock}/promotions`,
      promotionInputMock
    )
    expect(api.patch).toHaveBeenCalledWith(campaignPath, promotionInputMock)
  })

  it.each([
    ['pause', 'pause'],
    ['resume', 'resume'],
    ['end', 'end'],
  ] as const)('%s: posts the status action', async (method, action) => {
    vi.mocked(api.create).mockResolvedValue(promotionMock)

    await PromotionService[method](promotionUnitIdMock, promotionIdMock)

    expect(api.create).toHaveBeenCalledWith(`${campaignPath}/${action}`, undefined)
  })
})
