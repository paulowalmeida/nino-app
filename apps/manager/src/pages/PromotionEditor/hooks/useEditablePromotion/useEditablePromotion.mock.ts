import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'
import type { Promotion } from '@shared/types/marketing/promotion.type'

export const editableUnitIdMock = 'unit-1'

export const editablePromotionMock: Promotion = {
  ...promotionMock,
  id: 'promotion-gift',
  type: 'GIFT',
}

export const usedPromotionMock: Promotion = {
  ...editablePromotionMock,
  id: 'promotion-used',
  usageCount: 4,
}

export const retiredFreeDeliveryMock: Promotion = {
  ...promotionMock,
  id: 'promotion-free-delivery',
  type: 'FREE_DELIVERY',
}
