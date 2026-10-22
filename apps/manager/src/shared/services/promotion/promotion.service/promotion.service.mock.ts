import type { Promotion } from '@shared/types/marketing/promotion.type'
import type { PromotionInput } from '@shared/types/marketing/promotion-input.type'

export const promotionUnitIdMock = 'unit-1'
export const promotionIdMock = 'promotion-1'

export const promotionInputMock: PromotionInput = {
  name: 'Frete grátis acima de R$ 60,00',
  type: 'FREE_DELIVERY',
  minOrderValue: 60,
  startsAt: '2026-10-22T12:00:00.000Z',
  allDeliveryZones: true,
}

export const promotionMock: Promotion = {
  id: promotionIdMock,
  name: 'Frete grátis acima de R$ 60,00',
  description: null,
  type: 'FREE_DELIVERY',
  trigger: 'AUTOMATIC',
  code: null,
  value: 0,
  minOrderValue: 60,
  maxDiscount: null,
  channels: [],
  startsAt: '2026-10-22T12:00:00.000Z',
  endsAt: null,
  status: 'ACTIVE',
  state: 'ACTIVE',
  weekdays: [],
  dailyStartTime: null,
  dailyEndTime: null,
  allDeliveryZones: true,
  deliveryZoneIds: [],
  showInMenu: true,
  perCustomerLimit: null,
  totalLimit: null,
  usageCount: 0,
  productIds: [],
  categoryIds: [],
  createdAt: '2026-10-22T12:00:00.000Z',
  updatedAt: '2026-10-22T12:00:00.000Z',
}
