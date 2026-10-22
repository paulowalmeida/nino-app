import { api } from '@shared/services/http/http.service'
import type { Promotion } from '@shared/types/marketing/promotion.type'
import type { PromotionInput } from '@shared/types/marketing/promotion-input.type'

const promotionsPath = (unitId: string) => `units/${unitId}/promotions`

export const PromotionService = {
  list: (unitId: string): Promise<Promotion[]> =>
    api.get<Promotion[]>(promotionsPath(unitId)),

  create: (unitId: string, data: PromotionInput): Promise<Promotion> =>
    api.create<PromotionInput, Promotion>(promotionsPath(unitId), data),

  update: (
    unitId: string,
    promotionId: string,
    data: PromotionInput
  ): Promise<Promotion> =>
    api.patch<PromotionInput, Promotion>(
      `${promotionsPath(unitId)}/${promotionId}`,
      data
    ),

  pause: (unitId: string, promotionId: string): Promise<Promotion> =>
    api.create<undefined, Promotion>(
      `${promotionsPath(unitId)}/${promotionId}/pause`,
      undefined
    ),

  resume: (unitId: string, promotionId: string): Promise<Promotion> =>
    api.create<undefined, Promotion>(
      `${promotionsPath(unitId)}/${promotionId}/resume`,
      undefined
    ),

  end: (unitId: string, promotionId: string): Promise<Promotion> =>
    api.create<undefined, Promotion>(
      `${promotionsPath(unitId)}/${promotionId}/end`,
      undefined
    ),
}
