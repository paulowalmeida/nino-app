import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'
import type { Promotion } from '@shared/types/marketing/promotion.type'

export const contentPromotionsMock: Promotion[] = [
  { ...promotionMock, id: 'active-1' },
  {
    ...promotionMock,
    id: 'paused-1',
    state: 'PAUSED',
    status: 'PAUSED',
    minOrderValue: 80,
  },
]
