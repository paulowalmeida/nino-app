import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'
import type { Promotion } from '@shared/types/marketing/promotion.type'

export const editableUnitIdMock = 'unit-1'

export const usedPromotionMock: Promotion = {
  ...promotionMock,
  id: 'promotion-used',
  usageCount: 4,
}
