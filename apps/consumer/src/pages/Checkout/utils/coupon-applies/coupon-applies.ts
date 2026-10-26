import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { discountAmount } from '@utils/discount/discount'
import { giftApplies } from '@utils/gift/gift'

/* WHY: cupom fora da condição (mínimo, zona) faria a API recusar o pedido
 * inteiro; ele só vai no pedido quando já vale. */
export const couponApplies = (
  coupon: PublicPromotion,
  {
    subtotal,
    isFreeDeliveryApplied,
  }: { subtotal: number; isFreeDeliveryApplied: boolean }
): boolean => {
  if (coupon.type === 'FREE_DELIVERY') return isFreeDeliveryApplied
  if (coupon.type === 'GIFT') return giftApplies(coupon, subtotal)
  return discountAmount(coupon, subtotal) > 0
}
