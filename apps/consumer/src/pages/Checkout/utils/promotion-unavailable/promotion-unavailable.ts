import { ApiError } from '@nino/lib/utils/api-error'

type PromotionUnavailableBody = { code?: unknown; deliveryFee?: unknown }

/* WHY: o 409 do pedido também cobre idempotência e cashback; só o `code` diz
 * que foi a campanha que acabou, e o corpo traz o frete que passa a valer. */
export const promotionUnavailableFee = (error: unknown): number | null => {
  if (!(error instanceof ApiError) || error.status !== 409) return null
  const body = error.body as PromotionUnavailableBody | undefined
  return body?.code === 'PROMOTION_UNAVAILABLE' &&
    typeof body.deliveryFee === 'number'
    ? body.deliveryFee
    : null
}
