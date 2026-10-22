import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { api } from '@shared/services/http/http.service'

export const promotionService = {
  listVisible: (unitId: string): Promise<PublicPromotion[]> =>
    api.get<PublicPromotion[]>(`units/${unitId}/promotions/public`),
}
