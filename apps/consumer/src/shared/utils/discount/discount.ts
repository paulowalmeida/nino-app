import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

const roundMoney = (value: number) => Math.round(value * 100) / 100

// CONSTRAINT: mesma conta da API — percentual com teto, fixo nunca passa dos itens.
export const discountAmount = (
  promotion: PublicPromotion,
  subtotal: number
): number => {
  if (promotion.type === 'FREE_DELIVERY') return 0
  if (subtotal < promotion.minOrderValue) return 0
  const raw =
    promotion.type === 'FIXED_DISCOUNT'
      ? promotion.value
      : Math.min(
          (subtotal * promotion.value) / 100,
          promotion.maxDiscount ?? Infinity
        )
  return roundMoney(Math.min(raw, subtotal))
}

/* WHY: um desconto por pedido e o maior vence (spec §2.3); empate fica com o
 * primeiro, que é o cupom digitado quando ele vem antes na lista. */
export const largestDiscount = (
  candidates: (PublicPromotion | undefined)[],
  subtotal: number
): { promotion: PublicPromotion; amount: number } | undefined =>
  candidates.reduce<{ promotion: PublicPromotion; amount: number } | undefined>(
    (largest, promotion) => {
      if (!promotion) return largest
      const amount = discountAmount(promotion, subtotal)
      return amount > (largest?.amount ?? 0) ? { promotion, amount } : largest
    },
    undefined
  )

export const automaticDiscounts = (
  promotions: PublicPromotion[] = []
): PublicPromotion[] =>
  promotions
    .filter(
      ({ type, code }) =>
        (type === 'PERCENTAGE_DISCOUNT' || type === 'FIXED_DISCOUNT') && !code
    )
    .sort((first, second) => first.minOrderValue - second.minOrderValue)

export const couponSuggestions = (
  promotions: PublicPromotion[] = []
): PublicPromotion[] => promotions.filter(({ code }) => !!code)
