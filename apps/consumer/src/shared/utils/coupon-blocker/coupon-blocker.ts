import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { acceptsPayment } from '@utils/discount/discount'
import { brl } from '@utils/money/money'

export type CouponBlocker =
  | { kind: 'product'; productName: string | null }
  | { kind: 'payment' }
  | { kind: 'minimum'; missing: number; progress: number }

/* WHY: um motivo só por cupom, na ordem em que o cliente consegue agir:
 * trocar o item vem antes de completar o valor, e o valor antes de nada. */
export const couponBlocker = (
  coupon: PublicPromotion,
  {
    subtotal,
    paymentMethod,
    eligibleSubtotal = subtotal,
  }: { subtotal: number; paymentMethod?: string; eligibleSubtotal?: number }
): CouponBlocker | null => {
  if (coupon.type !== 'PERCENTAGE_DISCOUNT' && coupon.type !== 'FIXED_DISCOUNT')
    return null
  if (coupon.eligibleProductIds?.length && eligibleSubtotal === 0)
    return { kind: 'product', productName: coupon.eligibleProductName ?? null }
  if (!acceptsPayment(coupon, paymentMethod)) return { kind: 'payment' }
  if (subtotal < coupon.minOrderValue)
    return {
      kind: 'minimum',
      missing: Math.round((coupon.minOrderValue - subtotal) * 100) / 100,
      progress: Math.round((subtotal / coupon.minOrderValue) * 100),
    }
  return null
}

export const couponBlockerReason = (blocker: CouponBlocker): string => {
  if (blocker.kind === 'product')
    return blocker.productName
      ? `Vale só no ${blocker.productName}`
      : 'Vale só em itens selecionados'
  if (blocker.kind === 'payment') return 'Vale só com outra forma de pagamento'
  return `Faltam ${brl(blocker.missing)} para usar`
}
