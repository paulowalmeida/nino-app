import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'
import type { Promotion } from '@shared/types/marketing/promotion.type'

export const usedActiveCampaignMock: Promotion = {
  ...promotionMock,
  id: 'campaign-used',
  type: 'GIFT',
  name: 'Ganhe um brinde acima de R$ 60,00',
  usageCount: 12,
  totalLimit: 50,
  weekdays: [2],
  dailyStartTime: '18:00',
  dailyEndTime: '23:00',
  code: 'FRETE',
  showInMenu: false,
}

export const unusedPausedCampaignMock: Promotion = {
  ...promotionMock,
  id: 'campaign-paused',
  type: 'GIFT',
  name: 'Ganhe um brinde acima de R$ 80,00',
  createdBy: null,
  createdAt: '2026-10-24T12:00:00.000Z',
  minOrderValue: 80,
  state: 'PAUSED',
  status: 'PAUSED',
}

export const campaignTableEmptyMock = 'Nada por aqui.'
