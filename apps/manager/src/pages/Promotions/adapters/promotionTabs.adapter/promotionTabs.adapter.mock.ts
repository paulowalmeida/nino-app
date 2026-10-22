import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'
import type { Promotion } from '@shared/types/marketing/promotion.type'

export const tabbedPromotionsMock: Promotion[] = [
  { ...promotionMock, id: 'active-1' },
  { ...promotionMock, id: 'scheduled-1', state: 'SCHEDULED' },
  { ...promotionMock, id: 'paused-1', state: 'PAUSED', status: 'PAUSED' },
  { ...promotionMock, id: 'ended-1', state: 'ENDED', status: 'ENDED' },
  {
    ...promotionMock,
    id: 'exhausted-1',
    state: 'EXHAUSTED',
    code: 'FRETEVIP',
    minOrderValue: 0,
  },
]
