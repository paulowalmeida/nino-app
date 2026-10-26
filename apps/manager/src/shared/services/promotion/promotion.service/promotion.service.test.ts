import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { PromotionService } from './promotion.service'
import {
  promotionIdMock,
  promotionInputMock,
  promotionListQueryMock,
  promotionMock,
  promotionPageMock,
  promotionUnitIdMock,
} from './promotion.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), getAll: vi.fn(), create: vi.fn(), patch: vi.fn() },
}))

const campaignPath = `units/${promotionUnitIdMock}/promotions/${promotionIdMock}`

describe('PromotionService', () => {
  afterEach(() => vi.clearAllMocks())

  it('list: asks the API for one page and sends the search only when typed', async () => {
    vi.mocked(api.getAll).mockResolvedValue(promotionPageMock)

    await expect(
      PromotionService.list(promotionUnitIdMock, promotionListQueryMock)
    ).resolves.toEqual(promotionPageMock)
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${promotionUnitIdMock}/promotions`,
      { tab: 'active', target: 'createdAt', direction: 'desc', page: 1, size: 20 }
    )

    await PromotionService.list(promotionUnitIdMock, {
      ...promotionListQueryMock,
      search: 'ana',
    })
    expect(api.getAll).toHaveBeenLastCalledWith(
      `units/${promotionUnitIdMock}/promotions`,
      expect.objectContaining({ search: 'ana' })
    )
  })

  it('getById: reads one campaign', async () => {
    vi.mocked(api.get).mockResolvedValue(promotionMock)

    await expect(
      PromotionService.getById(promotionUnitIdMock, promotionIdMock)
    ).resolves.toEqual(promotionMock)
    expect(api.get).toHaveBeenCalledWith(campaignPath)
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

    expect(api.create).toHaveBeenCalledWith(
      `${campaignPath}/${action}`,
      undefined
    )
  })
})
