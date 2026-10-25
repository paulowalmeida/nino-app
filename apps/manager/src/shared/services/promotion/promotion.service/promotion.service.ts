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

  uploadImage: async (
    unitId: string,
    promotionId: string,
    file: File
  ): Promise<Promotion> => {
    const body = new FormData()
    body.append('file', file)
    return api.createFormData<Promotion>(
      `${promotionsPath(unitId)}/${promotionId}/image`,
      body
    )
  },

  removeImage: (unitId: string, promotionId: string): Promise<Promotion> =>
    api.remove<Promotion>(`${promotionsPath(unitId)}/${promotionId}/image`),

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
