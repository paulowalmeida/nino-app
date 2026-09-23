import { api } from '@shared/services/http/http.service'
import type { Promotion, PromotionInput } from '@shared/types/marketing/promotion'

export const PromotionService = {
  list: (unitId: string): Promise<Promotion[]> =>
    api.get<Promotion[]>(`units/${unitId}/promotions`),

  create: (unitId: string, data: PromotionInput): Promise<Promotion> =>
    api.create<PromotionInput, Promotion>(`units/${unitId}/promotions`, data),

  update: (
    unitId: string,
    promotionId: string,
    data: Partial<PromotionInput>
  ): Promise<Promotion> =>
    api.patch<Partial<PromotionInput>, Promotion>(
      `units/${unitId}/promotions/${promotionId}`,
      data
    ),
}
